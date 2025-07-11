/*
    this header is used to build a trie based on tokenization
    output the json file of tree
    stored under data/$userid/trie.txt
    {   
        "userid": "Admin",
        "root": {
            "slice": "",
            "alpha": "",
            "isEnd": false,
            "isWord": false,
            "children": [
                {
                    "slice": "a",
                    "alpha": "a".
                    "isEnd": true,
                    "isWord": true,
                    "children": []
                }
            ]
        }
    }
*/
#ifndef TRIE_H
#define TRIE_H

#include "tokenization.hpp"
#include "json.hpp"
#include <filesystem>

class Trie {
public:
    Trie(const std::string& userid, const std::string& path, const int file_index): _userid(userid), 
    _meta_path(path), _file_index(file_index), _root_english(nullptr), _root_chinese(nullptr) {
        std::ifstream meta_file(_meta_path);
        if (!meta_file.is_open()) {
            std::cerr << "Failed to open meta file" << std::endl;
            return;
        }

        std::string file_string = std::string(std::istreambuf_iterator<char>(meta_file), std::istreambuf_iterator<char>());

        meta_file.close();
        std::filesystem::path trie_json_path = _meta_path.parent_path();
        _trie_chinese_json_path = trie_json_path / std::filesystem::path("trie_chinese.json");
        _trie_english_json_path = trie_json_path / std::filesystem::path("trie_english.json");
        try {
            _meta_json = nlohmann::json::parse(file_string);
            if (_meta_json.contains(_userid)) {
                std::string filepath = _meta_json[_userid][_file_index]["path"];
                load_file(filepath);
                token.tokenizer(_file_string);
                token.init();

                _root_english = new Node();
                _root_chinese = new Node();
            }

        } catch(nlohmann::json::parse_error& e) {
            std::cerr << "Failed to parse json: " << e.what() << std::endl;
        }
    }

    ~Trie() {
        clear(_root_english);
        clear(_root_chinese);
    }

    struct Node {
        std::string slice = "";
        std::unordered_map<std::string, Node*> children;
        bool isEnd = true;
        bool isWord = false;
    };

    void run();

    void insert_chinese();
    void insert_english();

private:

    void insert_chinese_trie(); 
    void insert_english_trie();

    void load_english_json();
    void save_english_json();
    void load_chinese_json();
    void save_chinese_json();

    void change_english_json_trie();
    void change_chinese_json_trie();
    void add_node_json_trie(nlohmann::json& json_node, Node* trie_node);

    void change_english_trie_json();
    void change_chinese_trie_json();
    void add_node_trie_json(nlohmann::json& json_node, Node* trie_node);

    inline bool isSubstring(std::string& str, std::string& BigStr) {
        return BigStr.find(str) != std::string::npos;
    }

    inline void load_file(std::string& filepath) { 
        std::ifstream file(filepath);
        if (!file.is_open()) {
            std::cerr << "Failed to open file" << std::endl;
            return;
        }
        _file_string = std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
        file.close();
    }

    inline void clear(Node* node) {
        if (!node) return;
        for (auto& pair : node->children) {
            clear(pair.second);
        }
        delete node;
    }

    inline std::vector<std::string> iterate_utf8(const std::string& str) {
        vec_str output;
        for (size_t i = 0; i < str.length(); ) {
            int len = 3;
            std::string current_char = str.substr(i, len);
            output.emplace_back(current_char);
            i += len;
        }

        return output;
    }

    inline void insert_en(std::string& en) {
        Node* p = _root_english;
        for(auto& single: en) {
            std::string before_slice = p->slice;
            std::string single_string(1, single);
            if (p->children.find(single_string) == p->children.end()) {
                p->children[single_string] = new Node();
                p->isEnd = false;
            }

            p = p->children[single_string];
            p->slice = before_slice + single_string;
        }

        p->isWord = true;
    }

    inline void insert_ch(std::string& ch) {
        Node* p = _root_chinese;
        vec_str ch_vec = iterate_utf8(ch);
        for(auto& single: ch_vec) {
            std::string before_slice = p->slice;
            if (p->children.find(single) == p->children.end()) {
                p->children[single] = new Node();
                p->isEnd = false;
            }

            p = p->children[single];
            p->slice = before_slice + single;
        }

        p->isWord = true;
    }

    Tokenizer token;

    const std::string _userid;
    const std::filesystem::path _meta_path;
     std::filesystem::path _trie_chinese_json_path;
     std::filesystem::path _trie_english_json_path;
    nlohmann::json _meta_json;
    const int _file_index;
    std::string _file_string;
    Node* _root_english;
    Node* _root_chinese;
    nlohmann::json _trie_chinese_json;
    nlohmann::json _trie_english_json;
};

#endif