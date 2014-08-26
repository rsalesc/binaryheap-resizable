/**
 * Created by root on 25/08/14.
 */

var heapProvider = require('./index');

var heap = heapProvider(6, function(a,b){
    console.log("A: " + a.priority);
    console.log("B: " + b.priority);
    return a.priority > b.priority});

heap.push({priority: 8});
heap.push({priority: 3});
heap.push({priority: 11});
console.log(heap.toArray());
heap.push({priority: 5});
heap.push({priority: 4});

console.log(heap);
console.log(heap.toArray());

console.log("Popped: " + heap.pop());

console.log(heap);
console.log(heap.toArray());