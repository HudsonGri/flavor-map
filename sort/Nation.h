//
// Created by Erik Hartker on 12/6/22.
//

#pragma once
#include <string>
#include <vector>
#include "City.h"

struct Nation{
    std::vector<std::pair<std::string, float>> allNumReviews;
    std::vector<std::pair<std::string, float>> allPrices;
    std::vector<std::pair<std::string, float>> allRatings;
    float numReviews_;
    float price_;
    float rating_;
    void addCity(City city);
};
