#include "json.hpp"
#include <iostream>
#include <filesystem>
#include <fstream>

void load_json(std::filesystem::path& index_path, nlohmann::json& j) {
    std::ifstream file(index_path);
    if (!file.is_open()) {
        std::cout << j << std::endl;
        return;
    }

    std::string file_string = std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());

    try {
        j = nlohmann::json::parse(file_string);
    } catch (nlohmann::json::parse_error& e) {
        std::cout << j << std::endl;
    }
}

int main(int argc, char** argv) {
    if (argc != 2) {
        std::cerr << "Usage: ./load_index <userid>";
        return 0;
    }

    std::filesystem::path basedir = "../data";
    std::string userid = argv[1];
    std::filesystem::path index_path = basedir / userid / "inverted.json";
    nlohmann::json j = nlohmann::json::object();
    load_json(index_path, j);
    std::cout << j << std::endl;
}