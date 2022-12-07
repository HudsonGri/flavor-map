#include <vector>
#include <iostream>
#include <fstream>
#include <sstream>
#include "MergeSort.h"
#include "radixSort.h"
#include "City.h"
#include "Restaurant.h"
#include "Nation.h"

std::vector<std::string> getFilePaths(std::string path) {
    std::ifstream in(path);
    std::vector<std::string> files;
    std::string temp;
    while (std::getline(in, temp)) {
        std::string file = "../Data Collection/tsv/";
        file += temp;
        files.push_back(file);
    }
    return files;
}

bool checkSorts(std::vector<std::pair<std::string, int>>& countMerge, std::vector<std::pair<std::string, int>>& countRadix) {
    if (countMerge.size() != countRadix.size()) {
        return false;
    }
    for (int i = 0; i < countMerge.size(); i++) {
        if (countMerge[i].first != countRadix[i].first) {
            return false;
        }
        if (countMerge[i].second != countRadix[i].second) {
            return false;
        }
    }
    return true;
}

int main() {

    Nation nation;
    Nation nationCopy;

    std::vector<std::string> filePaths = getFilePaths("files.txt");
    std::ofstream out("output.txt");
    for (int i = 0; i < filePaths.size(); i++) {
        City city(filePaths[i].substr(23, filePaths[i].length() - 27));
        City cityCopy(filePaths[i].substr(23, filePaths[i].length() - 27));
        std::ifstream in;
        in.open(filePaths[i]);
        std::string temp;
        std::getline(in, temp);
        while (std::getline(in, temp)) {
            bool missing = false;
            istringstream read(temp);
            std::string na;
            for (int i = 0; i < 6; i++) {
                std::getline(read, na, '\t');
            }
            std::string name;
            std::getline(read, name, '\t');
            for (int i = 0; i < 4; i++) {
                std::getline(read, na, '\t');
            }
            std::string price;
            std::getline(read, price, '\t');
            if (price == "") {
                missing = true;
            }
            std::string rating;
            std::getline(read, rating, '\t');
            if (rating == "") {
                missing = true;
            }
            for (int i = 0; i < 3; i++) {
                std::getline(read, na, '\t');
            }
            std::string numReviews;
            std::getline(read, numReviews, '\t');
            if (numReviews == "") {
                missing = true;
            }
            std::string address;
            std::getline(read, address, '\t');
            if (missing) {
                continue;
            }
            // std::cout << name << std::endl;
            Restaurant restaurant(name, address, std::stoi(numReviews), std::stoi(price), std::stof(rating));
            city.addRestaurant(restaurant);
            cityCopy.addRestaurant(restaurant);
        }
        double mergeTime = -1, radixTime = -1;
        out << "City name " << city.name_ << std::endl;
        mergeTime = mergeSort(city.allNumReviews);
        out << "Merge sort times" << std::endl;
        out << "# of reviews " << mergeTime << " microseconds " << std::endl;
        for (int i = 0; i < city.allNumReviews.size(); i++) {
            out << city.allNumReviews[i].first << "\t";
        }
        out << std::endl;
        
        mergeTime = mergeSort(city.allPrices);
        out << "Prices " << mergeTime << " microseconds" << std::endl;
        for (int i = 0; i < city.allPrices.size(); i++) {
            out << city.allPrices[i].first << "\t";
        }
        out << std::endl;

        mergeTime = mergeSort(city.allRatings);
        out << "Ratings " << mergeTime << " microseconds" << std::endl;
        for (int i = 0; i < city.allRatings.size(); i++) {
            out << city.allRatings[i].first << "\t";
        }
        out << std::endl;


        out << "Radix sort times" << std::endl;
        radixTime = radixSort(cityCopy.allNumReviews);
        out << "# of reviews " << radixTime << " microseconds" << std::endl;
        radixTime = radixSort(cityCopy.allPrices);
        out << "Prices " << radixTime << " microseconds" << std::endl;
        vector<pair<string, int>> tempV;
        for (int i = 0; i < city.allRatings.size(); i++) {
            int changeInt = cityCopy.allRatings[i].second*10000;
            tempV.push_back(pair<string, int> (cityCopy.allRatings[i].first, changeInt));
        }
        radixTime = radixSort(tempV);
        out << "Ratings " << radixTime << " microseconds " << std::endl;

        for (int i = 0; i < city.allRatings.size(); i++){
            float changeInt = tempV[i].second/10000.0;
            cityCopy.allRatings[i] = pair<string, float>(tempV[i].first, changeInt);
        }

        //getting means for city attributes
        int sum = 0;
        for (int i = 0; i < city.allRatings.size(); i++){
            sum += city.allRatings[i].second;
        }
        city.rating_ = ((float)sum)/city.allRatings.size();

        sum = 0;
        for (int i = 0; i < city.allNumReviews.size(); i++){
            sum += city.allNumReviews[i].second;
        }
        city.numReviews_ = ((float)sum)/city.allNumReviews.size();

        sum = 0;
        for (int i = 0; i < city.allPrices.size(); i++){
            sum += city.allPrices[i].second;
        }
        city.price_ = ((float)sum)/city.allPrices.size();

        nation.addCity(city);
        nationCopy.addCity(city);
    }

    out << std::endl << "==== NATION ====" << std::endl;
    double mergeTime = -1, radixTime = -1;
    mergeTime = mergeSort(nation.allNumReviews);
    out << "Merge sort times" << std::endl;
    out << "# of reviews " << mergeTime << " microseconds" << std::endl;
    for (int i = 0; i < nation.allNumReviews.size(); i++) {
        out << nation.allNumReviews[i].first << "\t";
    }
    out << std::endl;

    mergeTime = mergeSort(nation.allPrices);
    out << "Prices " << mergeTime << " microseconds" << std::endl;
    for (int i = 0; i < nation.allPrices.size(); i++) {
        out << nation.allPrices[i].first << "\t";
    }
    out << std::endl;

    mergeTime = mergeSort(nation.allRatings);
    out << "Ratings " << mergeTime << " microseconds" << std::endl;
    for (int i = 0; i < nation.allRatings.size(); i++) {
        out << nation.allRatings[i].first << "\t";
    }
    out << std::endl;

    vector<pair<string, int>> tempAllNum;
    vector<pair<string, int>> tempAllPrices;
    vector<pair<string, int>> tempAllReviews;

    for (int i = 0; i < nation.allRatings.size(); i++) {
        int changeIntRating = nationCopy.allRatings[i].second*10000;
        int changeIntPrice = nationCopy.allPrices[i].second*10000;
        int changeIntNumReviews = nationCopy.allNumReviews[i].second*10000;
        tempAllReviews.push_back(pair<string, int> (nationCopy.allRatings[i].first, changeIntRating));
        tempAllPrices.push_back(pair<string, int> (nationCopy.allPrices[i].first, changeIntPrice));
        tempAllNum.push_back(pair<string, int> (nationCopy.allNumReviews[i].first, changeIntNumReviews));
    }


    out << "Radix sort times" << std::endl;
    radixTime = radixSort(tempAllNum);
    out << "# of reviews " << radixTime << " microseconds" << std::endl;
    radixTime = radixSort(tempAllPrices);
    out << "Prices " << radixTime << " microseconds" << std::endl;
    radixTime = radixSort(tempAllReviews);
    out << "Ratings " << radixTime << " microseconds" << std::endl;

    for (int i = 0; i < nation.allRatings.size(); i++){
        float changeIntP = tempAllPrices[i].second/10000.0;
        float changeIntR = tempAllReviews[i].second/10000.0;
        float changeIntN = tempAllNum[i].second/10000.0;
        nationCopy.allRatings[i] = pair<string, float>(tempAllReviews[i].first, changeIntR);
        nationCopy.allNumReviews[i] = pair<string, float>(tempAllNum[i].first, changeIntN);
        nationCopy.allPrices[i] = pair<string, float>(tempAllPrices[i].first, changeIntP);
    }

    return 0;
}
