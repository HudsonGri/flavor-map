// This implementation of merge sort references lecture slides 6 - Sorting covered in class
// https://www.folkstalk.com/tech/c-show-time-elapsed-with-code-examples/ was used to track elapsed execution time

#include <vector>
#include <chrono>
#include <iostream>
using namespace std::chrono;

template <typename T>
double mergeSort(std::vector<std::pair<std::string, T>>& v);
template <typename T>
void mergeSortHelper(std::vector<std::pair<std::string, T>>& v, int l, int r);
template <typename T>
void merge(std::vector<std::pair<std::string, T>>& v, int l, int mid, int r);

template <typename T>
double mergeSort(std::vector<std::pair<std::string, T>>& v) {
    std::chrono::steady_clock::time_point begin = std::chrono::steady_clock::now();
 
    // Call sort function
    mergeSortHelper(v, 0, v.size() - 1);
 
    // Get ending timepoint
    std::chrono::steady_clock::time_point end = std::chrono::steady_clock::now();
    auto duration = duration_cast<microseconds>(end - begin);
    return duration.count();
}

template <typename T>
void mergeSortHelper(std::vector<std::pair<std::string, T>>& v, int l, int r) {
    if (l < r) {
        int mid = l + (r - l) / 2;
        mergeSortHelper(v, l, mid);
        mergeSortHelper(v, mid + 1, r);
        merge(v, l, mid, r);
    }
}

template <typename T>
void merge(std::vector<std::pair<std::string, T>>& v, int l, int mid, int r) {
    std::vector<std::pair<std::string, T>> x(mid - l + 1), y(r - mid);
    x.assign(v.begin() + l, v.begin() + l + x.size());
    y.assign(v.begin() + l + x.size(), v.begin() + l + x.size() + y.size());

    int xInd = 0, yInd = 0, vInd = l;
    while (xInd < x.size() && yInd < y.size()) {
        if (x[xInd].second <= y[yInd].second) {
            v[vInd] = x[xInd];
            xInd++;
        }
        else {
            v[vInd] = y[yInd];
            yInd++;
        }
        vInd++;
    }
    while (xInd < x.size()) {
        v[vInd] = x[xInd];
        vInd++;
        xInd++;
    }
    while (yInd < y.size()) {
        v[vInd] = y[yInd];
        vInd++;
        yInd++;
    }
}