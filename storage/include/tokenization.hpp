/*
    this header is designed to tokenize.
    Both English and Chinese.
*/
#ifndef TOKENIZATION_H
#define TOKENIZATION_H

#include "cppjieba/Jieba.hpp"
#include "porter2_stemmer.h"
#include <algorithm>
#include <cctype>

using vec_str = std::vector<std::string>;

class Tokenizer {
public:

    Tokenizer(): _jieba(DICT_PATH, HMM_PATH, USER_DICT_PATH, IDF_PATH, STOP_WORD_PATH) {};
    Tokenizer(std::string& s): _file_string(s), 
    _jieba(DICT_PATH, HMM_PATH, USER_DICT_PATH, IDF_PATH, STOP_WORD_PATH) {}

    void tokenizer(std::string& s) {
        _file_string = s;
    }
    void init();

    vec_str get_chinese() {
        return _chinese_words;
    }
    vec_str get_english() {
        return _english_words;
    }
private:
    void tokenize_divider();

    void tokenize_filter(vec_str all_words); 

    inline bool is_english(std::string& s) {
        return ((s[0] & 0x80) == 0x00) ? true : false;
    }

    inline bool is_chinese(std::string& s) {
        return ((s[0] & 0xF0) == 0xE0) ? true : false;
    }
    const char* const DICT_PATH = "dict/jieba.dict.utf8";
    const char* const HMM_PATH = "dict/hmm_model.utf8";
    const char* const USER_DICT_PATH = "dict/user.dict.utf8";
    const char* const IDF_PATH = "dict/idf.utf8";
    const char* const STOP_WORD_PATH = "dict/stop_words.utf8";

    // string read from file
    std::string _file_string;
    vec_str _filtered_words;
    vec_str _english_words;
    vec_str _chinese_words;
    cppjieba::Jieba _jieba;
};

#endif