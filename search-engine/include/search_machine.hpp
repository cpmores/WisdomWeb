/*
    this header is used to deal with searching process
*/
#ifndef SEARCH_MACHINE_H
#define SEARCH_MACHINE_H

#include "tokenization.hpp"
#include <filesystem>
#include "json.hpp"

class SearchMachine {

public:
    SearchMachine(const std::string& userid, std::string& search_string, std::string& url_meta_path): _userid(userid), _search_string(search_string), _url_meta_path(url_meta_path) {
        token.tokenizer(_search_string);
        token.init();

        std::filesystem::path basedir(_url_meta_path.parent_path());
        _trie_english_path = basedir / "trie_english.json";
        _trie_chinese_path = basedir / "trie_chinese.json";
        _inverted_path = basedir / "inverted.json";
        load_inverted_json();
        load_url_meta_json();
        load_trie_chinese_json();
        load_trie_english_json();

        _root_chinese = new Node();
        _root_english = new Node();
        change_chinese_json_trie();
        change_english_json_trie();
    }

    void search() {
        search_inverted_important();
        change_important_json();
        std::cout << _important_json << std::endl;
    }


    ~SearchMachine() {
        clear(_root_chinese);
        clear(_root_english);
    }

    struct Node {
        std::string slice = "";
        std::unordered_map<std::string, Node*> children;
        bool isEnd = true;
        bool isWord = false;
    };

private:

    void load_inverted_json();
    void load_url_meta_json();
    void load_trie_chinese_json();
    void load_trie_english_json();
    void add_node_json_trie(nlohmann::json& json_node, Node* trie_node); 
    void change_english_json_trie(); 
    void change_chinese_json_trie();

    // begin word matching through trie
    std::vector<std::string> word_matching(std::string& prefix); 
    std::vector<std::string> word_matching_english(std::string& prefix);
    std::vector<std::string> word_matching_chinese(std::string& prefix);
    void collect_words(Node* p, std::vector<std::string>& found_string);

    // begin searching in inverted index
    void search_inverted_important();
    void search_inverted_all(std::string& all_word, bool uninit);

    void change_important_json();


    inline int language_section() {
        return is_full_chinese() ? 0 : is_full_english() ? 1 : 2;
    }

    inline bool is_full_chinese() {
        return (token.get_chinese().size() != 0 && token.get_english().size() == 0);
    }

    inline bool is_full_english() {
        return (token.get_chinese().size() == 0 && token.get_english().size() != 0);
    }

    // check prefix is english or chinese
    inline bool is_english(std::string& s) {
        return ((s[0] & 0x80) == 0x00) ? true : false;
    }

    inline void clear(Node* node) {
        if (!node) return;
        for (auto& pair : node->children) {
            clear(pair.second);
        }
        delete node;
    }

    Tokenizer token;

    const std::string _userid;
    std::string _search_string;

    std::filesystem::path _trie_chinese_path;
    std::filesystem::path _trie_english_path;
    std::filesystem::path _inverted_path;
    std::filesystem::path _url_meta_path;

    nlohmann::json _inverted_json;
    nlohmann::json _url_meta_json;
    nlohmann::json _trie_chinese_json;
    nlohmann::json _trie_english_json;

    Node* _root_english;
    Node* _root_chinese;

    std::unordered_map<int, double> _important;
    nlohmann::json _important_json;
};

#endif