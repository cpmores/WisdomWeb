#include "trie.hpp"

void Trie::run() {
    vec_str chinese = token.get_chinese();  
    vec_str english = token.get_english();

    for (auto& ch: chinese) {
        std::cout << "Chinese: " << ch << std::endl;
    }
    for (auto& en: english) {
        std::cout << "English: " << en << std::endl;
    }
}

void Trie::insert_english_trie() {
    vec_str english_vec = token.get_english();
    for (auto& en: english_vec) {
        insert_en(en);
    }
}
void Trie::insert_chinese_trie() {
    vec_str chinese_vec = token.get_chinese();
    for (auto& ch: chinese_vec) {
        insert_ch(ch);
    }
}

void Trie::load_english_json() {
    if (std::filesystem::exists(_trie_english_json_path)) {
        std::ifstream file(_trie_english_json_path);
        if (!file.is_open()) {
            std::cerr << "Failed to open trie json file on load english" << std::endl;
            _trie_english_json = nlohmann::json::object();
        }

        std::string file_string = std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());

        try {
            _trie_english_json = nlohmann::json::parse(file_string);
        } catch (nlohmann::json::parse_error& e) {
            std::cerr << "Failed to parse json: " << e.what() << std::endl;
            _trie_english_json = nlohmann::json::object();
        }
    }
}

void Trie::save_english_json() {
    std::ofstream file(_trie_english_json_path);
    if (!file.is_open()) {
        std::cerr << "Failed to open trie json" << std::endl;
        return;
    }

    file << _trie_english_json.dump(2);
}

void Trie::load_chinese_json() {
    if (std::filesystem::exists(_trie_chinese_json_path)) {
        std::ifstream file(_trie_chinese_json_path);
        if (!file.is_open()) {
            std::cerr << "Failed to open trie json file on load chinese" << std::endl;
            _trie_chinese_json = nlohmann::json::object();
        }

        std::string file_string = std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());

        try {
            _trie_chinese_json = nlohmann::json::parse(file_string);
        } catch (nlohmann::json::parse_error& e) {
            std::cerr << "Failed to parse json: " << e.what() << std::endl;
            _trie_chinese_json = nlohmann::json::object();
        }
    }
}

void Trie::save_chinese_json() {
    std::ofstream file(_trie_chinese_json_path);
    if (!file.is_open()) {
        std::cerr << "Failed to open trie json" << std::endl;
        return;
    }

    file << _trie_chinese_json.dump(2);
}

void Trie::add_node_json_trie(nlohmann::json& json_node, Node* trie_node) {
    trie_node->slice = json_node["slice"];
    trie_node->isEnd = json_node["isEnd"].get<bool>();
    trie_node->isWord = json_node["isWord"].get<bool>();
    if (trie_node->isEnd) {
        return;
    }
    for (auto& child: json_node["children"]) {
        Node* new_node = new Node();
        add_node_json_trie(child, new_node);
        trie_node->children[child["alpha"]] = new_node;
    }
}

void Trie::change_english_json_trie() {
    if (_trie_english_json.contains("root")) {
        Node* p = _root_english;
        add_node_json_trie(_trie_english_json["root"], p);
    }
}

void Trie::change_chinese_json_trie() {
    if (_trie_chinese_json.contains("root")) {
        Node* p = _root_chinese;
        add_node_json_trie(_trie_chinese_json["root"], p);
    }
}

void Trie::add_node_trie_json(nlohmann::json& json_node, Node* trie_node) {
    json_node["slice"] = trie_node->slice;
    json_node["isEnd"] = trie_node->isEnd;
    json_node["isWord"] = trie_node->isWord;
    json_node["children"] = nlohmann::json::array(); 
    if (trie_node->isEnd) return;
    for (auto& child_trie: trie_node->children) {
        nlohmann::json child_json = nlohmann::json::object();
        child_json["alpha"] = child_trie.first;
        add_node_trie_json(child_json, child_trie.second);
        json_node["children"].emplace_back(child_json);
    }
}

void Trie::change_english_trie_json() {
    _trie_english_json = {};
    _trie_english_json["userid"] = _userid;
    _trie_english_json["root"] = nlohmann::json::object();
    Node* p = _root_english;
    add_node_trie_json(_trie_english_json["root"], p);
    _trie_english_json["root"]["alpha"] = "";
}

void Trie::change_chinese_trie_json() {
    _trie_chinese_json = {};
    _trie_chinese_json["userid"] = _userid;
    _trie_chinese_json["root"] = nlohmann::json::object();
    Node* p = _root_chinese;
    add_node_trie_json(_trie_chinese_json["root"], p);
    _trie_chinese_json["root"]["alpha"] = "";
}

void Trie::insert_chinese() {
    load_chinese_json();
    change_chinese_json_trie();
    insert_chinese_trie();
    change_chinese_trie_json();
    save_chinese_json();
}
void Trie::insert_english() {
    load_english_json();
    change_english_json_trie();
    insert_english_trie();
    change_english_trie_json();
    save_english_json();
}

