'use strict';

// Require k-means for 1 dimention vectors
const k1means = require('./lib/onekmeans');

// start: Naive Bayes --------------------------------------------------
module.exports = function() {

  // Declare object variables
  this.results = {};
  this.naivebayes = {};
  this.total_records = 0;

  // Changes continuous variables in discrete variables
  this.discretizeDataset = function(dataset, exceptFor) {
    // Looks for all variables that are continuous
    const ContinuousFeatures = {};
    for (const f in dataset[1]) {
      if (typeof(dataset[1][f]) === 'number') ContinuousFeatures[f] = true;
    }
    for (let f=0; f<exceptFor.length; f++) {
      delete ContinuousFeatures[exceptFor[f]];
    }

    // k-means settings
    const cluster_num = 20;
    const iterations = 200;

    // For every continuous feature
    for (const f in ContinuousFeatures) {
      // Extract the vectors of values of the feature f
      const vector = dataset.map((row) => Number(row[f]));
      // Make feature a discrete variable
      const cluster = new k1means(vector, cluster_num, iterations);
      const discretizedFeature = cluster.get_means_of_clusters();
      // Replace continuous values with discrete values
      for (let i=0; i<dataset.length; i++) {
        dataset[i][f] = String(discretizedFeature[i]);
      }
    }
    return dataset;
  }

  // Clean the dataset
  this.cleanDataset = function(dataset, featureList) {
    for (let d=0; d<dataset.length; d++) {
      for (let f=0; f<featureList.length; f++) {
       delete dataset[d][featureList[f]];
      }
    }
    return dataset;
  }

  this.get_number_of_cases = function() {
   this.total_records = 0;
   for (const label in this.naivebayes) this.total_records += this.naivebayes[label].num;
  }

  // Train the naive bayes model
  this.train = function(dataset, label) {
    this.total_records += dataset.length;
    for (let d=0; d < dataset.length; d++) {
      if (this.naivebayes[dataset[d][label]] === undefined) this.naivebayes[dataset[d][label]] = {num: 0};
      this.naivebayes[dataset[d][label]].num += 1;
      for (const effect in dataset[d]) {
        if (!new RegExp('^'+effect+'$').test(label)) {
          const theValue = String(dataset[d][effect]);
          if (this.naivebayes[dataset[d][label]][effect] === undefined) this.naivebayes[dataset[d][label]][effect] = {};
          if (this.naivebayes[dataset[d][label]][effect][theValue] === undefined) this.naivebayes[dataset[d][label]][effect][theValue] = 0;
          this.naivebayes[dataset[d][label]][effect][theValue] += 1;
        }
      }
    }
  }

  // Make predictions
  // Log(P(Cause|Effect1,Effect2,Effect3)) = Log(P(Cause))+( Log(P(Effect1|Cause))*Log(P(Effect2|Cause))*...)
  this.computeInLogScale = function() {
    for (const label in this.naivebayes) {
      // Compute probability with logarithm scale
      this.results[label] = Math.log(this.naivebayes[label].num / this.total_records);
      for (const effect in this.naivebayes[label]) {
        for (const theValue in this.naivebayes[label][effect]) {
          const PeffectCause = Math.log(this.naivebayes[label][effect][theValue] / this.naivebayes[label].num);
          this.results[label] += PeffectCause;
        }
      }
      // More negative is the value more small the probability
      // Example: Math.log(0.9) = -0.105, Math.log(0.1) = -2.302
      // -2.302 has a lower probability than -0.105 to happen
    }
  }

  // P(Cause|Effect1,Effect2,Effect3) = P(Cause)*(P(Effect1|Cause)*P(Effect2|Cause)*...)
  this.compute = function() {
    for (const label in this.naivebayes) {
      this.results[label] = this.naivebayes[label].num / this.total_records;
      for (const effect in this.naivebayes[label]) {
        for (const theValue in this.naivebayes[label][effect]) {
          this.results[label] = this.results[label] * (this.naivebayes[label][effect][theValue] / this.naivebayes[label].num);
        }
      }
    }
  }

  // Clean the train model and the results
  this.cleanTheModel = function() {
    this.results = {};
    this.naivebayes = {};
    this.total_records = 0;
    return true;
  }

}
// end: Naive Bayes ----------------------------------------------------
