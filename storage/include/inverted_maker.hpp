/*
    this file is used to make inverted files based on tokenization.
    pass chinese and english. write to a single inverted index file.
    including searching, appending, deleting
    {
        "index": {
            "totalCount": 2,
            "mapping": {
                "1": 10,
                "4": 15
            }
        }
    }
*/

#ifndef INVERTED_MAKER_H
#define INVERTED_MAKER_H

#include <iterator>
#include <vector>
#include <string>
#include <filesystem>
#include <iostream>
#include <fstream>
#include "json.hpp"

class InvertedMaker {

public:
    // need to check before use
    InvertedMaker() {};
    InvertedMaker(std::filesystem::path path): _inverted_path(path) {};

    void invertedMaker(std::filesystem::path path) {
        _inverted_path = path;
    }

    void append(std::vector<std::string> chinese, std::vector<std::string> english, int file_index);
    void remove(std::vector<std::string> chinese, std::vector<std::string> english, int file_index);

private:
    void load();
    void save();

    nlohmann::json _j;
    std::filesystem::path _inverted_path; 
};

#endif