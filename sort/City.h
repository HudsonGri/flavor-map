#pragma once
#include <string>
#include <vector>
#include "Restaurant.h"

struct City {
    std::vector<Restaurant> restaurants;
    std::vector<std::pair<std::string, int>> allNumReviews;
    std::vector<std::pair<std::string, int>> allPrices;
    std::vector<std::pair<std::string, float>> allRatings;
    std::string name_;
    float numReviews_;
    float price_;
    float rating_;

    City(std::string name);
    void addRestaurant(Restaurant restaurant);
};