/*
    this header is used to manager the overall module storage,
    including appending, deleteting, refreshing
*/

#ifndef INDEX_MANAGER_H
#define INDEX_MANAGER_H

#include <filesystem>
#include <string>
#include "inverted_maker.hpp"
#include "json.hpp"
#include "tokenization.hpp"

class IndexManager {
public:
    IndexManager(const std::string& userid, const std::string& meta_path, int file_index): 
    _userid(userid), _meta_path(meta_path), _file_index(file_index) {
        _inverted_path = _meta_path.parent_path() / "inverted.json"; 
        load_meta_json();
        load_tokenizer();
        load_invertedMaker();
    } 

    void append();
    void remove();

private:
    
    void load_meta_json(); 
    void save_meta_json();
    void load_tokenizer();
    void load_invertedMaker();
    inline bool need_append() {
        return !_meta_json[_userid][_file_index]["is_inverted"].get<bool>();
    }
    inline void changeInverted() {
        _meta_json[_userid][_file_index]["is_inverted"] = true;
        save_meta_json();
    }
    inline bool need_remove() {
        return _meta_json[_userid][_file_index]["is_inverted"].get<bool>();
    }
    inline void changeDeleted() {
        _meta_json[_userid][_file_index]["is_inverted"] = false;
        save_meta_json();
    }

    inline std::string removeFirstThreeLines(const std::string& input) {
        size_t pos = 0;
        for (int i = 0; i < 3; ++i) {
            pos = input.find('\n', pos);
            if (pos == std::string::npos) {
                return "";
            }
            ++pos;
        }
        return input.substr(pos);
    }
    

    const std::string _userid;
    std::filesystem::path _meta_path;
    std::filesystem::path _inverted_path;
    nlohmann::json _meta_json;
    int _file_index;

    Tokenizer token;
    InvertedMaker invertedMaker;

};

#endif