# Naive Bayes classifier

## Description
A node.js module for Naive Bayes classifier.

It works also with continuous variables and can return results in log scale. There is also a function to clean the dataset.

## Installation

    $ npm install naivebayes-predictor

## Example
```javascript
// Require Naive Bayes module
var NaiveBayes = require('naivebayes-predictor');

// Get a dataset
var dataset = [
		{skill: 'mathematics', industry: 'finance', age: 18, score: 5, verified: 0},
		{skill: 'mathematics', industry: 'finance', age: 18, score: 6, verified: 0},
		{skill: 'mathematics', industry: 'business', age: 18, score: 8, verified: 1},
		{skill: 'mathematics', industry: 'finance', age: 18, score: 7, verified: 0},
		{skill: 'economy', industry: 'finance', age: 30, score: 4, verified: 1},
		{skill: 'economy', industry: 'sales', age: 32, score: 3, verified: 0},
		{skill: 'economy', industry: 'business', age: 31, score: 3, verified: 1},
		{skill: 'economy', industry: 'business', age: 34, score: 4, verified: 1},
    {...}
];

// Make continuous variables discrete detecting range intervals inside every single variable
dataset = naive.discretizeDataset(
		dataset,
		["verified"] // List of continuous variables to not convert as discrete
);

// Train the model
naive.train(
	dataset,
	"skill"  // Name of the label to classify
);

// Compute the results
naive.compute();
// Distribution in scale from 0.0 to 1.0

// Show the results about "skill" feature
console.log(naive.results);
// { mathematics: 0.017578125, economy: 0.0029296875 }

// Clean the model and the results
naive.cleanTheModel();

// Use another dataset
var dataset = [{...}, {...}, etc.];

// Optional: clean the dataset from some variable
dataset = naive.cleanDataset(
		dataset,
		['PassengerId','Name'] // The names of the variables to delete
);

// Make continuous variables discrete detecting range intervals inside every single variable
dataset = naive.discretizeDataset(
		dataset,
		["Survived"] // List of continuous variables to not convert as discrete
);

// Train the model
naive.train(
	dataset,
	"Survived" // Name of the label to classify
);

// Compute the results
naive.compute();
// Distribution in scale from 0.0 to 1.0

// Compute the results in log scale
naive.computeInLogScale();
// More negative is the value more small the probability
// { '0': -3361.759725902712, '1': -2087.72499485088 }

// Show the results about "Survived" feature
console.log(naive.results);
```
