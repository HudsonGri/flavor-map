//
// Created by Erik Hartker on 12/6/22.
//
#include "Nation.h"

void Nation::addCity(City city) {
    allNumReviews.push_back(std::pair<std::string, float> (city.name_ ,city.numReviews_));
    allPrices.push_back(std::pair<std::string, float> (city.name_ ,city.price_));
    allRatings.push_back(std::pair<std::string, float> (city.name_, city.rating_));
}
