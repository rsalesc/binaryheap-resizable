[![npm status](http://img.shields.io/npm/v/binaryheap-resizable.svg)](https://www.npmjs.org/package/binaryheap-resizable)
[![build status](https://secure.travis-ci.org/rsalesc/binaryheap-resizable.svg)](http://travis-ci.org/rsalesc/binaryheap-resizable)
[![dependency status](https://david-dm.org/rsalesc/binaryheap-resizable.svg)](https://david-dm.org/rsalesc/binaryheap-resizable)
[![experimental](http://img.shields.io/badge/stability-experimental-DD5F0A.svg)](http://nodejs.org/api/documentation.html#documentation_stability_index)


# Resizable Binary Heap
---

### What package is that?

Exactly what the package name says it is. It's a resizable binary heap.

### What do you exactly mean by resizable?

With `binaryheap-resizable` you can pre-allocate an array space for your binary heap with no worrying about when it's gonna be fulfilled. It expands and shrink itself automatically as elements are inserted to/pulled from the heap. You can even resize it by yourself using the `resize()` member method!

### But what? I don't want my application to be re-allocating memory for a heap all the time!

That's why `binaryheap-resizable` got a `resizeFactor` property. Every time the heap data array is expanded, it's expanded to `BinaryHeap.length * 2`. You specify how much your array will be expanded/shrinked, so depending on your array initial size and on your demands you can control how often the application will be re-allocating memory to the heap.

### Ok. Since it's a binary heap, how can I control the ordering criteria?

The heap has a `predicate()` get/setter method. You can set the binary heap predicate by passing a function `fn(a, b)` as an argument, where `a` is the parent element and `b` is its child. By default `binaryheap-resizable` has a `predicate` set to a max-heap predicate.

```javascript
var predicate = function(a, b){
    return a > b;
}
```
So we have a pseudo-code which:

```
predicate(top-element, child-n) is truthy for n 1..top-element-child-count
```

We can have a min-heap predicate only by switching the relational operator:
```javascript
var predicate = function(a, b){
    return a < b;
}
```

You can implement the criteria you want. It's all up to you. We have to watch out for some specific cases, though. Null-objects can't be inserted to the heap. An error will be certainly throwed. However, nothing prevents you from adding a solid object which contains a null property. Let's see an example:

```javascript
var predicate = function(a, b){
    return a.relevance > b.relevance;
}

predicate({relevance: 1}, {});
predicate({relevance: 1}, {relevance: null});
```

Both `predicate()` calls right above will not result in error, since undefined and null are still comparable, producing a unpredictable behavior. It's not what most of programmers want, so, if its not what you wait from the algorithm, you should better use a deep find algorithm which throws an error if an object property is not a solid object, right inside the predicate.

In another study-case example we have:

```javascript
var predicate = function(a, b){
    return a.info.relevance > b.info.relevance;
}

predicate({info: { relevance: 1}}, {info: null});
predicate({info: { relevance: 1}}, {});
```

Now in both calls above we will notice that an error is throwed. That's because we can't access a non-existent object property. In this case, we can't access the property `relevance` of `undefined`/`null`.

So, it's up to you to control the predicate flow, to prevent errors from ocurrying if necessary or similar things.
A **deep find** plugin that is capable of returning default values can be **extremely** useful if you want to make things keep going smooth when executing more complex `predicate()`.



