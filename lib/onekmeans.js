'use strict';

// K-Means algorithm for 1D
module.exports = function(dataset, cluster_num, iterations) {
 // Make euclidean distance
 this.euclidean_distance = function(p,q) {
   return Math.abs(p-q);
 }

 this.cluster_num_of_items = [];
 this.cluster_means = [];
 for (let i=0; i<cluster_num; i++) {
   this.cluster_means.push(dataset[Math.floor(Math.random()*dataset.length)]);
   this.cluster_num_of_items.push(0);
 }
 this.partial_means = this.cluster_means;
 this.results = [];

 // Process K-Means for that dataset
 for (let iter=1; iter<=iterations; iter++) {
  for (let i=0; i<dataset.length; i++) {
   let previous_dist = null;
   let index_to_set = 0;
   for (let c=0; c<cluster_num; c++) {
    const current_dist = this.euclidean_distance(this.partial_means[c],dataset[i]);
    if ((previous_dist === null) || (current_dist < previous_dist)) {
     previous_dist = current_dist;
     index_to_set = c;
    }
   }
   // i -> item (index of dataset)
   // index_to_set -> cluster
   this.cluster_means[index_to_set] += dataset[i];
   this.cluster_num_of_items[index_to_set] += 1;
   if (iter >= iterations) this.results.push([i, index_to_set]);
  }
  for (let c=0; c<cluster_num; c++) {
   this.cluster_means[c] = this.cluster_means[c] / this.cluster_num_of_items[c];
   this.cluster_num_of_items[c] = 0;
  }
  this.partial_means = this.cluster_means.slice(0);
 }

 this.print_results = function() {
   for (let i=0; i<this.results.length; i++) {
     console.log(`${i} --> ${dataset[this.results[i][0]]} [Cluster: ${this.results[i][1]}] => ${this.cluster_means[this.results[i][1]]}`);
   }
 }

 this.get_means_of_clusters = function() {
   return this.results.map(function(onerow) {
     return Number(onerow[1]);
   });
 }

};
