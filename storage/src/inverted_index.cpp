/*
    this file is used to build inverted index.
    The two files are stored under data/$user/
    Everytime a new web is added, index table will update.
*/
#include "index_manager.hpp"

int find_file_index(const std::string& filepath, const std::string& url, const std::string& userid) {
    std::ifstream file(filepath);
    if (!file.is_open()) {
        std::cerr << "Failed to open file" << std::endl;
        return 0;
    }

    std::string file_string = std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
    try {
        nlohmann::json url_meta = nlohmann::json::parse(file_string);
        if (url_meta.contains(userid)) {
            if (url_meta[userid]["urlId"].contains(url)) {
                return url_meta[userid]["urlId"][url].get<int>();
            }
            return 0;
        }

        return 0;
    } catch (nlohmann::json::parse_error& e) {
        std::cerr << "Failed to parse json." << std::endl;
        return 0;
    }
}

int main(int argc, char* argv[]) {
    if (argc != 4) {
        std::cerr << "Usage: " << argv[0] << " <url> <userid> <operation>" << std::endl;
        std::cerr << "Operation must be 'append' or 'remove'" << std::endl;
        return 1;
    }

    const std::string url = argv[1];
    const std::string userid = argv[2];
    const std::string operation = argv[3];
    const std::string meta_filepath = "../data/" + userid +"/meta.json";
    const std::string url_meta_filepath = "../data/" + userid + "/url_meta.json";

    if (operation != "append" && operation != "remove") {
        std::cerr << "Invalid operation: " << operation << ". Must be 'append' or 'remove'" << std::endl;
        return 1;
    }

    int file_index = find_file_index(url_meta_filepath, url, userid);
    IndexManager index_manager(userid, meta_filepath, file_index);

    if (operation == "append") {
        index_manager.append();
        std::cout << "IndexManager append completed for URL: " << url << ", User: " << userid << std::endl;
    } else {
        index_manager.remove();
        std::cout << "IndexManager remove completed for URL: " << url << ", User: " << userid << std::endl;
    }

    return 0;
}