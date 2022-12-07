#pragma once
#include <string>

struct Restaurant {
    std::string name_;
    std::string address_;
    int numReviews_;
    int price_;
    float rating_;


    Restaurant(std::string name, std::string address, int numReviews, int price, float rating);
};