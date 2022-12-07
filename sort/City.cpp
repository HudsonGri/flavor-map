#include "City.h"

City::City(std::string name) {
    name_ = name;
}

void City::addRestaurant(Restaurant restaurant) {
    restaurants.push_back(restaurant);
    allNumReviews.push_back({ restaurant.name_, restaurant.numReviews_ });
    allPrices.push_back({ restaurant.name_, restaurant.price_ });
    allRatings.push_back({ restaurant.name_, restaurant.rating_ });
}