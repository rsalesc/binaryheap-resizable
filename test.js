/**
 * Created by root on 25/08/14.
 */

var heapProvider = require('./index');

var heap = heapProvider(6, function(a,b){
    return a.priority > b.priority});

heap.push({priority: 5});
console.log(heap.toArray());
heap.push({priority: 8});
console.log(heap.toArray());
heap.push({priority: 4});
console.log(heap.toArray());
heap.push({priority: 11});
console.log(heap.toArray());
heap.push({priority: 3});
console.log(heap.toArray());


console.log("----");
console.log(heap.toArray());

console.log("Popped: " + heap.pop());
heap.pop();

console.log(heap.toArray());