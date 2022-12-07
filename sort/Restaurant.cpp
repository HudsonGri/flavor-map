#include "Restaurant.h"

Restaurant::Restaurant(std::string name, std::string address, int numReviews, int price, float rating) {
    name_ = name;
    address_ = address;
    numReviews_ = numReviews;
    price_ = price;
    rating_ = rating;
}