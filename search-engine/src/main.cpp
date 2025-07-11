#include "search_machine.hpp"

int main(int argc, char** argv) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <userid> <search_string> " << std::endl;
        return 1;
    }

    const std::string userid = argv[1];
    std::string search_string = argv[2];
    std::string url_meta_path = "./data/" + userid + "/url_meta.json";
    SearchMachine searchMachine(userid, search_string, url_meta_path);
    searchMachine.search();
    return 0;
}