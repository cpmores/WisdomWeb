#include "inverted_maker.hpp"

void InvertedMaker::load() {
    if (std::filesystem::exists(_inverted_path)) {
        std::ifstream file_stream(_inverted_path);
        if (!file_stream.is_open()) {
            std::cerr << "Failed to open inverted file in Inverted Maker." << std::endl;
            return;
        }

        std::string file_string = std::string(std::istreambuf_iterator<char>(file_stream), std::istreambuf_iterator<char>());
        file_stream.close();

        try {
            _j = nlohmann::json::parse(file_string);
        } catch (nlohmann::json::parse_error& e) {
            std::cerr << "Parse Error in Inverted Maker: " << e.what() << std::endl; 
        }
    } else {
        _j = nlohmann::json::object();
    }
}

void InvertedMaker::save() {
    std::ofstream file_stream(_inverted_path);
    if (!file_stream.is_open()) {
        std::cerr << "Failed to open inverted file in Inverted Maker." << std::endl;
        return;
    }

    file_stream << _j.dump(2);
    file_stream.close();
}

void InvertedMaker::append(std::vector<std::string> chinese, std::vector<std::string> english, int file_index) {
    load();
    for (auto& ch: chinese) {
        if (!_j.contains(ch) || !_j[ch].is_object()) {
            _j[ch] = {
                {"totalCount", 0},
                {"mapping", nlohmann::json::object()}
            };
        }
        if (_j.contains(ch)) {
            nlohmann::json& word_list = _j[ch]["mapping"];
            if (word_list.contains(std::to_string(file_index))) {
                word_list[std::to_string(file_index)] = word_list[std::to_string(file_index)].get<int>() + 1;
            } else {
                word_list[std::to_string(file_index)] = 1;
            }

            _j[ch]["totalCount"] = _j[ch]["totalCount"].get<int>() + 1;
        } 
    }
    for (auto& en: english) {
        if (!_j.contains(en) || !_j[en].is_object()) {
            _j[en] = {
                {"totalCount", 0},
                {"mapping", nlohmann::json::object()}
            };
        }
        if (_j.contains(en)) {
            nlohmann::json& word_list = _j[en]["mapping"];
            if (word_list.contains(std::to_string(file_index))) {
                word_list[std::to_string(file_index)] = word_list[std::to_string(file_index)].get<int>() + 1;
            } else {
                word_list[std::to_string(file_index)] = 1;
            }

            _j[en]["totalCount"] = _j[en]["totalCount"].get<int>() + 1;
        } 
    }
    save();
}

void InvertedMaker::remove(std::vector<std::string> chinese, std::vector<std::string> english, int file_index) {
    load();
    for (auto& ch: chinese) {
        if (_j.contains(ch)) {
            nlohmann::json& word_list = _j[ch]["mapping"];
            if (word_list.contains(std::to_string(file_index)) && word_list[std::to_string(file_index)].get<int>() > 0) {
                word_list[std::to_string(file_index)] = word_list[std::to_string(file_index)].get<int>() - 1;
                _j[ch]["totalCount"] = _j[ch]["totalCount"].get<int>() - 1;
            } 

            if (word_list[std::to_string(file_index)].get<int>() <= 0) {
                word_list.erase(std::to_string(file_index));
            }

            if (_j[ch]["totalCount"].get<int>() <= 0) {
                _j.erase(ch);
            }
        } 
    }
    for (auto& en: english) {
         if (_j.contains(en)) {
            nlohmann::json& word_list = _j[en]["mapping"];
            if (word_list.contains(std::to_string(file_index)) && word_list[std::to_string(file_index)].get<int>() > 0) {
                word_list[std::to_string(file_index)] = word_list[std::to_string(file_index)].get<int>() - 1;
                _j[en]["totalCount"] = _j[en]["totalCount"].get<int>() - 1;
            } 

            if (word_list[std::to_string(file_index)].get<int>() <= 0) {
                word_list.erase(std::to_string(file_index));
            }

            if (_j[en]["totalCount"].get<int>() <= 0) {
                _j.erase(en);
            }
        }         
    }
    save();
}