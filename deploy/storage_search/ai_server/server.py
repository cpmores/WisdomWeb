from flask import Flask, request, jsonify, make_response
from volcenginesdkarkruntime import Ark
import os
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)

# 初始化豆包客户端
client = Ark(
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    api_key=os.getenv("ARK_API_KEY"),
)

# 全局对话历史，按 userid 隔离
conversation_histories = {}


def process_txt_files(folder_path):
    """递归读取指定文件夹及其子文件夹下所有TXT文件内容"""
    all_content = []
    for root, _, files in os.walk(folder_path):
        for filename in files:
            if filename.endswith(".txt"):
                filepath = os.path.join(root, filename)
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()
                        all_content.append(
                            f"【文件:{os.path.relpath(filepath, folder_path)}】\n{content}"
                        )
                except Exception as e:
                    print(f"读取文件{filename}出错: {str(e)}")
    return "\n\n".join(all_content)


def initialize_documents(userid):
    """为特定用户初始化文档内容"""
    TXT_FOLDER_PATH = os.path.join("..", "data", userid)

    if not os.path.isdir(TXT_FOLDER_PATH):
        print(f"警告：文件夹路径不存在 {TXT_FOLDER_PATH}")
        return False

    documents_content = process_txt_files(TXT_FOLDER_PATH)
    if not documents_content:
        print(f"警告：用户 {userid} 没有找到任何TXT文件")
        return False

    # 构建系统提示词
    system_prompt = f"""你是一个专业的内容分析助手。我已经上传了以下文档：
    {documents_content}
    请仔细阅读这些文档内容，后续我将基于这些文档内容提问。"""

    # 初始化该用户的对话历史
    global conversation_histories
    conversation_histories[userid] = [
        {"role": "system", "content": system_prompt},
        {
            "role": "assistant",
            "content": "我已成功学习您上传的文档内容，请开始提问吧！",
        },
    ]
    return True


@app.route("/chat", methods=["POST"])
def chat():
    """处理用户提问"""
    data = request.get_json()
    userid = data.get("userid")
    message = data.get("message")

    if not userid or not message:
        return jsonify({"error": "userid 和 message 参数必填"}), 400

    # 如果该用户尚未初始化对话历史，则加载文档
    if userid not in conversation_histories:
        if not initialize_documents(userid):
            return jsonify(
                {"error": f"用户 {userid} 的文档初始化失败，请检查文件夹路径和文件内容"}
            ), 500

    # 添加用户消息到对应用户的对话历史
    conversation_histories[userid].append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model="doubao-1-5-thinking-pro-250415",
            messages=conversation_histories[userid],
            stream=False,
        )

        assistant_response = response.choices[0].message.content
        conversation_histories[userid].append(
            {"role": "assistant", "content": assistant_response}
        )

        return make_response(
            json.dumps({"response": assistant_response}, ensure_ascii=False),
            {"Content-Type": "application/json; charset=utf-8"},
        )

    except Exception as e:
        conversation_histories[userid].pop()  # 移除失败的用户输入
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3003, debug=True)
