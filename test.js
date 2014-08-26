/**
 * Created by root on 25/08/14.
 */

var heapProvider = require('./index');

var heap = heapProvider(20);

heap.push(8);
heap.push(3);
heap.push(11);
console.log(heap.toArray());
heap.push(5);
heap.push(4);

console.log(heap);
console.log(heap.toArray());

console.log("Popped: " + heap.pop());

console.log(heap);
console.log(heap.toArray());