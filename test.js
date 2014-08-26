/**
 * Created by root on 25/08/14.
 */

var heapProvider = require('./index');

var heap = heapProvider(6, function(a,b){
    return a.priority > b.priority});

heap.push({priority: 5});
heap.push({priority: 8});
heap.push({priority: 4});
heap.push({priority: 11});
heap.push({priority: 3});


console.log("----");
console.log(heap.toArray());

console.log("Popped: " + heap.pop());

console.log(heap.toArray());

console.log("Popped: " + heap.pop());

console.log(heap.toArray());