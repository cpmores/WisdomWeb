import json
import logging
from typing import Dict, List, Any
import requests
from urllib.parse import unquote
from flask import Flask, request, jsonify
from flask_cors import CORS  # 导入 CORS

import os

# 从环境变量读取前缀树服务器地址，设置默认值
TRIE_SERVER_URL = os.getenv("TRIE_SERVER_URL", "http://trie-server:3002/trie-json")



app = Flask(__name__)
CORS(app)  # 开启 CORS 支持
app.config['JSON_AS_ASCII'] = False  # 确保 JSON 响应支持中文

# 配置日志
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 存储前缀树的全局字典，按用户分类，非持久化
trie_storage = {}



class TrieNode:
    def __init__(self, alpha: str, is_end: bool, is_word: bool, slice: str):
        self.alpha = alpha
        self.is_end = is_end
        self.is_word = is_word
        self.slice = slice
        self.children = []

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'TrieNode':
        try:
            node = TrieNode(data['alpha'], data['isEnd'], data['isWord'], data['slice'])
            node.children = [TrieNode.from_dict(child) for child in data['children']]
            return node
        except KeyError as e:
            logger.error(f"Invalid trie data format: missing key {e}")
            raise ValueError(f"Invalid trie data format: missing key {e}")

def is_chinese_prefix(prefix: str) -> bool:
    """判断前缀是否为中文（基于 Unicode 范围）"""
    logger.debug(f"Checking prefix: {prefix}, chars: {[ord(c) for c in prefix]}")
    is_chinese = any('\u4e00' <= char <= '\u9fff' for char in prefix)
    logger.debug(f"Is Chinese: {is_chinese}")
    return is_chinese

def search_trie(trie: TrieNode, prefix: str, language: str) -> List[str]:
    """在前缀树中搜索匹配前缀的单词，中文直接匹配，英文大小写不敏感"""
    logger.debug(f"Searching {language} trie with prefix: {prefix}")
    results = []
    if not prefix:
        def collect_all_words(node: TrieNode, current_words: List[str]):
            if node.is_word:
                current_words.append(node.slice)
            for child in node.children:
                collect_all_words(child, current_words)
        collect_all_words(trie, results)
        return results

    node = trie
    for char in prefix if language == 'chinese' else prefix.lower():
        logger.debug(f"Matching char: {char} (Unicode: {ord(char)})")
        found = False
        for child in node.children:
            compare_char = child.alpha if language == 'chinese' else child.alpha.lower()
            logger.debug(f"Comparing with child.alpha: {child.alpha} (Unicode: {ord(child.alpha) if child.alpha else 'None'})")
            if compare_char == char:
                node = child
                found = True
                break
        if not found:
            logger.debug(f"No match found for prefix: {prefix} in {language} trie")
            return []

    def collect_words(node: TrieNode, current_words: List[str]):
        if node.is_word:
            current_words.append(node.slice)
        for child in node.children:
            collect_words(child, current_words)

    collect_words(node, results)
    logger.debug(f"Search results: {results}")
    return results

def fetch_trie_from_server(userid: str) -> Dict[str, Any]:
    """向前缀树服务器请求用户的前缀树数据，并记录等效的 curl 命令"""
    try:
        headers = {"Content-Type": "application/json"}
        payload = {"userid": userid}
        curl_command = f'curl -X POST -H "Content-Type: application/json" -d \'{json.dumps(payload, ensure_ascii=False)}\' {TRIE_SERVER_URL}'
        logger.debug(f"Sending request to trie server: {curl_command}")

        response = requests.post(TRIE_SERVER_URL, headers=headers, json=payload, timeout=5)
        response.raise_for_status()
        data = response.json()
        logger.debug(f"Raw trie data for user {userid}: {json.dumps(data, ensure_ascii=False, indent=2)}")

        if data.get("message") != "Trie Get completed successfully":
            logger.error(f"Invalid response from trie server for user {userid}")
            raise ValueError("Invalid response from trie server")

        return data
    except requests.RequestException as e:
        logger.error(f"Failed to fetch trie data for user {userid}: {str(e)}")
        raise

def store_trie_data(userid: str, data: Dict[str, Any]):
    """存储从服务器接收的前缀树数据"""
    try:
        if userid not in trie_storage:
            trie_storage[userid] = {"chinese": None, "english": None}

        if "chinese_trie" in data["trieOutput"] and data["trieOutput"]["chinese_trie"].get("root"):
            trie_storage[userid]["chinese"] = TrieNode.from_dict(data["trieOutput"]["chinese_trie"]["root"])
            logger.info(f"Chinese trie stored for user {userid}, root alpha: {trie_storage[userid]['chinese'].alpha}")
        else:
            logger.warning(f"No valid chinese_trie found in server response for user {userid}")

        if "english_trie" in data["trieOutput"] and data["trieOutput"]["english_trie"].get("root"):
            trie_storage[userid]["english"] = TrieNode.from_dict(data["trieOutput"]["english_trie"]["root"])
            logger.info(f"English trie stored for user {userid}, root alpha: {trie_storage[userid]['english'].alpha}")
        else:
            logger.warning(f"No valid english_trie found in server response for user {userid}")
    except (KeyError, ValueError) as e:
        logger.error(f"Error storing trie data for user {userid}: {str(e)}")
        raise

@app.route('/search', methods=['GET'])
def search():
    """根据前缀查询单词，自动判断语言"""
    userid = request.args.get('userid')
    prefix = unquote(request.args.get('prefix'))  # 显式解码 URL 参数

    if not userid or not prefix:
        logger.error(f"Missing userid or prefix: userid={userid}, prefix={prefix}")
        return jsonify({'error': 'Missing userid or prefix', 'userid': userid}), 400

    logger.debug(f"Prefix: {prefix}, Unicode: {[ord(c) for c in prefix]}, Is Chinese: {is_chinese_prefix(prefix)}")
    language = 'chinese' if is_chinese_prefix(prefix) else 'english'
    logger.debug(f"Querying {language} trie for user {userid} with prefix {prefix}")

    if userid not in trie_storage:
        try:
            data = fetch_trie_from_server(userid)
            store_trie_data(userid, data)
        except Exception as e:
            logger.error(f"Failed to fetch or store trie data for user {userid}: {str(e)}")
            return jsonify({'error': 'Failed to fetch trie data', 'userid': userid}), 500

    if not trie_storage[userid][language]:
        logger.error(f"No {language} trie found for user {userid}")
        return jsonify({'error': f'No {language} trie found for user', 'userid': userid}), 404

    trie = trie_storage[userid][language]
    results = search_trie(trie, prefix, language)
    return jsonify({'results': results, 'userid': userid, 'language': language}), 200

@app.route('/logout', methods=['POST'])
def logout():
    """用户登出，清除前缀树数据"""
    userid = request.form.get('userid')
    if not userid:
        logger.error("Missing userid in logout request")
        return jsonify({'error': 'Missing userid', 'userid': None}), 400

    if userid in trie_storage:
        del trie_storage[userid]
        logger.info(f"User {userid} data cleared")
        return jsonify({'message': f'User {userid} data cleared', 'userid': userid}), 200
    else:
        logger.error(f"No data found for user {userid}")
        return jsonify({'error': f'No data found for user {userid}', 'userid': userid}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)