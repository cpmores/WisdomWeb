#include "tokenization.hpp"

void Tokenizer::init() {
    std::vector<std::string> all_words;
    _jieba.CutForSearch(_file_string, all_words);
    _filtered_words.clear();
    tokenize_filter(all_words);
    tokenize_divider();
}

void Tokenizer::tokenize_divider() {
    for (auto word: _filtered_words) {
        if (is_english(word)) {
            std::transform(word.begin(), word.end(), word.begin(), [](unsigned char c)
        {
            return std::tolower(c);
        });
            // Porter2Stemmer::trim(word);
            // Porter2Stemmer::stem(word);
            _english_words.emplace_back(word);
        } else if (is_chinese(word)) {
            _chinese_words.emplace_back(word);
        }
    }
}

void Tokenizer::tokenize_filter(vec_str all_words) {
        // get stop words first
        std::unordered_set<std::string> stop_words;
        std::ifstream stop_file(STOP_WORD_PATH);
        if (!stop_file.is_open()) {
            std::cerr << "Failed to open stop words file: " << STOP_WORD_PATH << std::endl;
            return;
        }
        std::string stop_line;
        while (getline(stop_file, stop_line)) {
            stop_words.insert(stop_line);
        }

        stop_file.close();

        std::string no_newline = "\n\t\r";
        for (auto word: all_words) {
            // 并非停用词
            if (stop_words.find(word) == stop_words.end() && no_newline.find(word) == std::string::npos) {
                _filtered_words.emplace_back(word);
            }
        }
    }