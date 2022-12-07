//
// Created by Erik Hartker on 12/5/22.
//
#include <vector>
#include <string>
#include <chrono>
using namespace std;
using namespace std::chrono;

//radix sort inspired by https://www.geeksforgeeks.org/radix-sort/ and https://www.youtube.com/watch?v=OKd534EWcdk&t=181s
// https://www.folkstalk.com/tech/c-show-time-elapsed-with-code-examples/ was used to track elapsed execution time


int radixSort(vector<pair<string,int>>& v);
void countSort(vector<pair<string,int>>& v, int n);
int findHighest(vector<pair<string,int>>& v);


int radixSort(vector<pair<string,int>>& v){

    auto begin = std::chrono::steady_clock::now();

    //finding max element to know max number of runs for countSort()
    int max = findHighest(v);

    //calling countSort successively until vector is sorted
    for (int i = 1; max > i; i *= 10){
        countSort(v, i);
    }

    // Get ending timepoint
    auto end = std::chrono::steady_clock::now();
    auto duration = duration_cast<microseconds>(end - begin);
    return duration.count();
}

void countSort(vector<pair<string, int>>& v, int n){
    vector<int> occurrences(10, 0);
    vector<pair<string, int>> sorted(v.size());

    //count occurrences of each digit and store them in vector
    for (int i = 0; i < v.size(); i++){
        //gets element, divides it by appropriate amount, and uses modulus to obtain digit value
        occurrences[(v[i].second/n) % 10] += 1;
    }

    //adding previous element to current element
    for (int i = 1; i < occurrences.size(); i++){
        occurrences[i] += occurrences[i - 1];
    }

    //shifting every element in occurrence one to the right
    int temp = occurrences[0];
    occurrences[0] = 0;
    for (int i = 1; i < occurrences.size(); i++){
        int temp2 = temp;
        temp = occurrences[i];
        occurrences[i] = temp2;
    }

    //sorting by digit
    for (int i = 0; i < v.size(); i++){
        sorted[occurrences[(v[i].second/n) % 10]] = v[i];
        occurrences[(v[i].second/n) % 10]++;
    }

    //copying sorted vector into original vector
    for (int i = 0; i < sorted.size(); i++){
        v[i] = sorted[i];
    }
}

//finding the maximum element in a vector
int findHighest(vector<pair<string,int>>& v){
    int max = 0;
    for (int i = 0; i < v.size(); i++){
        if (v[i].second > max){
            max = v[i].second;
        }
    }
    return max;
}

