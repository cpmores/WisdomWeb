#include "search_machine.hpp"

void SearchMachine::load_inverted_json() {
    std::ifstream file(_inverted_path);
    if (!file.is_open()) {
        std::cerr << "Failed to open inverted json file." << std::endl;
        _inverted_json = nlohmann::json::object();
        return;
    }

    std::string file_string = std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
    try {
        _inverted_json = nlohmann::json::parse(file_string);
    } catch(nlohmann::json::parse_error& e) {
        std::cerr << "Failed to parse inverted json" << std::endl;
        _inverted_json = nlohmann::json::object();
    }
}
void SearchMachine::load_url_meta_json() {
    std::ifstream file(_url_meta_path);
    if (!file.is_open()) {
        std::cerr << "Failed to open inverted json file." << std::endl;
        _url_meta_json =  nlohmann::json::object();
        return;
    }

    std::string file_string = std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
    try {
        _url_meta_json = nlohmann::json::parse(file_string);
    } catch(nlohmann::json::parse_error& e) {
        std::cerr << "Failed to parse inverted json" << std::endl;
        _url_meta_json = nlohmann::json::object();
    }
}
void SearchMachine::load_trie_chinese_json() {

    std::ifstream file(_trie_chinese_path);
    if (!file.is_open()) {
        std::cerr << "Failed to open trie chinese json file." << std::endl;
        _trie_chinese_json = nlohmann::json::object();
        return;
    }

    std::string file_string = std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
    try {
        _trie_chinese_json = nlohmann::json::parse(file_string);
    } catch(nlohmann::json::parse_error& e) {
        std::cerr << "Failed to parse trie chinese json" << std::endl;
        _trie_chinese_json = nlohmann::json::object();
    }
}
void SearchMachine::load_trie_english_json() {
    std::ifstream file(_trie_english_path);
    if (!file.is_open()) {
        std::cerr << "Failed to open trie english json file." << std::endl;
        _trie_english_json = nlohmann::json::object();
        return;
    }

    std::string file_string = std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
    try {
        _trie_english_json = nlohmann::json::parse(file_string);
    } catch(nlohmann::json::parse_error& e) {
        std::cerr << "Failed to parse trie english json" << std::endl;
        _trie_english_json = nlohmann::json::object();
    }

}

void SearchMachine::add_node_json_trie(nlohmann::json& json_node, Node* trie_node) {
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

void SearchMachine::change_english_json_trie() {
    if (_trie_english_json.contains("root")) {
        Node* p = _root_english;
        add_node_json_trie(_trie_english_json["root"], p);
    }
}

void SearchMachine::change_chinese_json_trie() {
    if (_trie_chinese_json.contains("root")) {
        Node* p = _root_chinese;
        add_node_json_trie(_trie_chinese_json["root"], p);
    }
}

std::vector<std::string> SearchMachine::word_matching(std::string& prefix) {
    if (is_english(prefix)) 
        return word_matching_english(prefix);
    return word_matching_chinese(prefix);
}

std::vector<std::string> SearchMachine::word_matching_english(std::string& prefix) {
    std::vector<std::string> found_string;
    int count = 0;
    Node* p = _root_english;
    for (auto& en: prefix) {
        std::string key(1, en);
        if (p->children.find(key) == p->children.end()) {
            return found_string; 
        }

        p = p->children[key];
    }

    collect_words(p, found_string);
    for(auto& found:found_string) {
    }
    return found_string;
}

std::vector<std::string> SearchMachine::word_matching_chinese(std::string& prefix) {
    std::vector<std::string> found_string;
    Node* p = _root_chinese;
    size_t pos = 0;

    while (pos < prefix.size()) {
        if (pos + 2 >= prefix.size()) {
            return found_string;
        }

        std::string key = prefix.substr(pos, 3);
        if (p->children.find(key) == p->children.end()) {
            return found_string;
        }

        p = p->children[key];
        pos += 3;
    }

    collect_words(p, found_string);
    for(auto& found:found_string) {
    }
    return found_string;
}

void SearchMachine::collect_words(Node* p, std::vector<std::string>& found_string) {
    if (p->isWord) {
        found_string.emplace_back(p->slice);
    }

    if (p->isEnd) {
        return;
    }

    for(auto& [key, child]: p->children) {
        collect_words(child, found_string);
    }
}


void SearchMachine::search_inverted_all(std::string& all_word, bool uninit) {
    vec_str all_words = word_matching(all_word);
    std::unordered_map<int, double> prefix_important;
    // all words是一个前缀所派生的词集
    if (all_words.size() > 0) {
        for(std::string& word: all_words) {
            if (_inverted_json.contains(word)) {
                nlohmann::json mapping = _inverted_json[word]["mapping"];
                double totalCount = _inverted_json[word]["totalCount"].get<int>();
                for (auto& pair:mapping.items()) {
                    if (prefix_important.find(std::stoi(pair.key())) == prefix_important.end()) {
                        prefix_important[std::stoi(pair.key())] = 0.0; 
                    }
                    if (prefix_important.find(std::stoi(pair.key())) != prefix_important.end()) {
                        prefix_important[std::stoi(pair.key())] += double(pair.value()) / totalCount;
                    }
                }
            }
        }


        if (uninit) {
            _important = prefix_important;
        } else {
            for(auto& import: prefix_important) {
                if (_important.find(import.first) != _important.end()) {
                    _important[import.first] += import.second;
                }
            }

            for(auto& import: _important) {
                if (prefix_important.find(import.first) == prefix_important.end()) {
                    _important.erase(import.first);
                }
            }
        }
    }
}

void SearchMachine::search_inverted_important() {
    // all_words 是搜索的分词
    vec_str all_words = token.get_all();
    if (all_words.size() > 0) {
        bool uninit = true;
        for (auto& all_word: all_words) {
            // 对每一个分词进行寻找前缀词，和查找inverted操作，前缀词的文件操作取并集，同一
            // 前缀内部取并集，不同派生的取交集
            if (word_matching(all_word).size() > 0) {
                search_inverted_all(all_word, uninit);
                uninit = false;
            }
        }
    }
}

void SearchMachine::change_important_json() {
    _important_json = nlohmann::json::object();
    _important_json["userid"] = _userid;
    nlohmann::json url_list = nlohmann::json::object();
    if (_url_meta_json.contains(_userid)) {
        for(auto& import: _important) {
            std::string url = _url_meta_json[_userid]["Idurl"][std::to_string(import.first)];
            url_list[url] = import.second;
        }
    }

    _important_json["urlList"] = url_list;
    _important_json["urlCount"] = _important.size();
}