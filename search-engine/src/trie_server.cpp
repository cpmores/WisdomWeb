/*
    this file is used to load and send trie json
*/

#include "json.hpp"
#include <iostream>
#include <filesystem>
#include <fstream>
#include <iterator>

void load_json(std::filesystem::path& path, nlohmann::json& j) {
    std::ifstream file(path);
    if(!file.is_open()) {
        std::cerr << "Failed to open json file" << std::endl;
        return;
    } 

    std::string file_string = std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());

    try {
        j = nlohmann::json::parse(file_string);
    } catch(nlohmann::json::parse_error& e) {
        std::cerr << "Failed to parse json file: " << e.what() << std::endl;
    }
}

int main(int argc, char** argv) {
    if (argc != 2) {
        std::cerr << "Usage: ./trie_get <userid>" << std::endl;
        return 0; 
    }

    const std::string userid = argv[1];
    std::filesystem::path basedir = "../data";
    std::filesystem::path trie_chinese_path = basedir / userid / "trie_chinese.json"; 
    std::filesystem::path trie_english_path = basedir / userid / "trie_english.json"; 

    nlohmann::json trie_chinese_json = nlohmann::json::object();
    nlohmann::json trie_english_json = nlohmann::json::object();
    load_json(trie_chinese_path, trie_chinese_json);
    load_json(trie_english_path, trie_english_json);

    nlohmann::json batch_trie = nlohmann::json::object();
    batch_trie["chinese_trie"] = trie_chinese_json;
    batch_trie["english_trie"] = trie_english_json;

    std::cout << batch_trie << std::endl;
    return 0;
}