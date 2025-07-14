#include "index_manager.hpp"

void IndexManager::load_meta_json() {
    std::fstream file(_meta_path);
    if (!file.is_open()) {
        std::cerr << "Failed to Open " << _inverted_path << std::endl;
        return;
    }

    std::string file_string = std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
    file.close();

    try {
        _meta_json = nlohmann::json::parse(file_string);
    } catch (nlohmann::json::parse_error& e) {
        std::cerr << "Parse Error: " << e.what() << std::endl;
    }
}

void IndexManager::save_meta_json() {
    std::ofstream file(_meta_path);
    if (!file.is_open()) {
        std::cerr << "Failed to Open " << _inverted_path << std::endl;
        return;
    }

    file << _meta_json.dump(2);

    file.close();
}

void IndexManager::load_tokenizer() {
    std::string file_string("");
    if (_meta_json.contains(_userid)) {
        auto& all_path = _meta_json[_userid];
        auto& spec_file_meta = all_path[_file_index];
        const std::string filename = spec_file_meta["path"];
        std::ifstream openfile(filename);
        if (!openfile.is_open()) {
            std::cerr << "Failed to open " << filename << " in get_all_user_file." << std::endl;
            return;
        }

        file_string = std::string(std::istreambuf_iterator<char>(openfile), std::istreambuf_iterator<char>());
        openfile.close();
        file_string = removeFirstThreeLines(file_string);

        token.tokenizer(file_string);
        token.init();
    } 
}

void IndexManager::load_invertedMaker() {
    invertedMaker.invertedMaker(_inverted_path);
}

void IndexManager::append() {
    if (need_append()) {
        vec_str chinese = token.get_chinese();
        vec_str english = token.get_english();
        invertedMaker.append(chinese, english, _file_index);
        changeInverted();
    }
}

void IndexManager::remove() {
    if (need_remove()) {
        vec_str chinese = token.get_chinese();
        vec_str english = token.get_english();
        invertedMaker.remove(chinese, english, _file_index);
        changeDeleted();
    }
}