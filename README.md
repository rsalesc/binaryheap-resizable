[![npm status](http://img.shields.io/npm/v/binaryheap-resizable.svg)](https://www.npmjs.org/package/binaryheap-resizable)
[![build status](https://secure.travis-ci.org/rsalesc/binaryheap-resizable.svg)](http://travis-ci.org/rsalesc/binaryheap-resizable)
[![dependency status](https://david-dm.org/rsalesc/binaryheap-resizable.svg)](https://david-dm.org/rsalesc/binaryheap-resizable)
[![experimental](http://img.shields.io/badge/stability-experimental-DD5F0A.svg)](http://nodejs.org/api/documentation.html#documentation_stability_index)

# Resizable Binary Heap
---

### Installation
`npm install binaryheap-resizable`

### Testing
`npm test`

### Simple usage

```javascript
var maxHeap = BinaryHeap([5, 3, 2]).maxHeap();
    or
var maxHeap = BinaryHeap([5, 3, 2]).predicate().greater();
// set it up as a simple max-heap
// its initial length is 3 and its initial data is the maxHeapified
// version of the passed array

var minObjectHeap = BinaryHeap(4).minHeap('priority');
    or
var minObjectHeap = BinaryHeap(4).predicate().lesser('priority');
// set it up as a object min-heap of initial length equals to 4
// compare objects from the heap by their priority property
// when inserted/pulled, throw an error if property does not exist
```

### API

##### Constructors
1. `constructor(initial-length)` - build an empty heap with `initial-length` size.
2. `constructor(array)` - heapify `array`. initial length is set to `array.length`.

##### Predicates
1. `predicate().greater([ property [, default]])` - set heap as max-heap. if `property` is set, elements `property` values will be used when comparing. if this value is not accessible and `default` is set, `default` will be used instead.
2. `predicate().lesser([ property [, default]])` - same as above, but it will set heap as min-heap.
3. `predicate(fn).value([ property [, default]])` - same as above, but it will use `fn` as the predicate
4. `maxHeap()` - alias for `predicate().greater()`
5. `minHeap()` - alias for `predicate().lesser()`

##### Data management methods
1. `insert(elements..), insert(array-of-elements)` - insert all passed elements in the heap, doing reallocations if necessary. returns new heap size. alias `push()`.
2. `peek()` - return the root element of the heap or null if heap is empty.
3. `pull()` - peek and remove the peeked element from the heap if its not null. alias `pop()`
4. `resizeFactor([factor])` - get/set how much the heap buffer will expand/shrink when needed. default is `2`.
5. `resize(n)` - manually resize the heap buffer to `n`.
6. `toArray()` - return an array representation of the heap

##### Properties
1. `size` - store how many elements are on the heap.
2. `length` - get the length of the heap buffer.

### What package is that?

Exactly what the package name says it is. It's a resizable binary heap.

### What do you exactly mean by resizable?

With `binaryheap-resizable` you can pre-allocate an array space for your binary heap with no worrying about when it's gonna be fulfilled. It expands and shrink itself automatically as elements are inserted to/pulled from the heap. You can even resize it by yourself using the `resize()` member method!

### But what? I don't want my application to be re-allocating memory for a heap all the time!

That's why `binaryheap-resizable` got a `resizeFactor` property. Every time the heap data array is expanded, it's expanded to `BinaryHeap.length * resizaFactor`. You specify how much your array will be expanded/shrinked, so depending on your array initial size and on your demands you can control how often the application will be re-allocating memory to the heap. `resizeFactor` default value is `2`.

### Ok. Since it's a binary heap, how can I control the ordering criteria?

The heap constructor has an argument called `predicate`. You can set the binary heap predicate by passing a function `fn(a, b)` as that argument, where `a` is the parent element and `b` is its child. By default `binaryheap-resizable` has a `predicate` set to a max-heap predicate.

```javascript
var predicate = function(a, b){
    return a > b;
}
```
So we have a pseudo-code which:

```
predicate(top-element, child-n) is truthy for n 1..top-element-child-count
```

So in version `0.0.7` we introduced new ways of handling predicates. We will be discussing about them right below.

### Multiple ways of handling predicates
###### *>= 0.0.7*

In older versions we had only the basic way of dealing with predicates. It was really hard to deal with errors and to keep things going smooth when going through non-existent objects. Version `0.0.7` introduced major changes related to the way predicates were set up. It's important to say that projects that were built on top of older versions are still perfectly compatible with this new version.

##### Default method, in constructor

The old version way is still available but **we highly recommend you to avoid it** for non-number objects. Here's the min-heap predicate example.

```javascript
var predicate = function(a, b){
    return a < b;
}

var heap = new BinaryHeap(4, predicate);
// create a min-heap with initial capacity of 4
```

This method can not handle object properties very well.

##### Deep finding way

In `0.0.7` the functional way of handling predicates was introduced. It's now simple to define your predicate and control the behavior of your application when dealing with deep objects. Let's say you want to order a max-heap by their `priority` properties. In the old fashioned way you would do something like this:

```javascript
// old deprecated way
var predicate = function(a, b){
    return a.priority > b.priority;
}

var heap = new BinaryHeap(4, predicate);
// you will probably have problems dealing with non-existent objects or null properties
```

You could avoid the problems by rewriting your `predicate` code to check for these problems before doing the real job. But it's just **awful**. Then we introduce you a clean way of dealing with these issues.

```javascript
// a and b are now real values
var predicate = function(a, b){
    return a < b;
}

// BinaryHeap(capacity).predicate(predicate).value([path [, default-value]])
// value() function returns a BinaryHeap object reference that can be used

var heap1 = BinaryHeap(4).predicate(predicate).value('priority');
var heap2 = BinaryHeap(4).predicate(predicate).value('priority', 1);
// heap1 inserts and pulls may throw an error when priority property does not exist
// heap2 inserts and pulls will set a default value to be compared when priority property does not exist
```

This code does basically what the deprecated code does, but you can define a solid behavior when dealing with properties passing a `path` argument to deep find that property, or even pass a `default-value` argument to be set as default value when a property does not exist, avoiding access errors.

When comparing it does something like this: (pseudo-code):
```javascript
// heap1
a.priority < b.priority or throw an error if property priority does not exist
// heap2
a.priority < b.priority if property priority exists in both objects
    or
1 < b.priority if property priority exists only in b object
    or
a.priority < 1 if property priority exists only in a object
    or
1 < 1 if property priority does not exist in both objects
```

##### Preset-based way

The preset-based way is just what we described above, passing no arguments to `predicate` and using `greater()` and `lesser()` in place of `value()`. Using this we can quickly build max/min-heaps from raw numbers or numbers from deep objects properties.

```javascript
var heap1 = BinaryHeap(4).predicate().greater('priority', 1);
// max-heap comparing (a.priority or 1) > (b.priority or 1)
var heap2 = BinaryHeap(4).predicate().lesser('info.relevance', 2);
// min-heap comparing (a.info.relevance or 2) < (b.info.relevance or 2)
```

We can also use the aliases to `predicate().greater()` and `predicate().lesser()`

```javascript
var heap1 = BinaryHeap(4).maxHeap('priority', 1);
// max-heap comparing (a.priority or 1) > (b.priority or 1)
var heap2 = BinaryHeap(4).minHeap('info.relevance', 2);
// min-heap comparing (a.info.relevance or 2) < (b.info.relevance or 2)
```
