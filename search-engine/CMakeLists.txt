cmake_minimum_required(VERSION 3.10)
project(Search)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include_directories(${CMAKE_SOURCE_DIR}/include)

add_executable(search-engine src/main.cpp src/porter2_stemmer.cpp src/tokenization.cpp src/search_machine.cpp)

file(COPY ${CMAKE_SOURCE_DIR}/dict DESTINATION ${CMAKE_BINARY_DIR})