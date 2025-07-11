cmake_minimum_required(VERSION 3.10)
cmake_policy(SET CMP0167 OLD)
project(WisdomWeb_storage)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include_directories(${CMAKE_SOURCE_DIR}/include)

# find_package(Boost REQUIRED)

add_executable(inverted_index src/inverted_index.cpp src/tokenization.cpp src/porter2_stemmer.cpp src/inverted_maker.cpp src/index_manager.cpp)
add_executable(trie_index src/trie_index.cpp src/trie.cpp src/tokenization.cpp src/porter2_stemmer.cpp)
# target_link_libraries(inverted_index PRIVATE Boost)

file(COPY ${CMAKE_SOURCE_DIR}/dict DESTINATION ${CMAKE_BINARY_DIR})