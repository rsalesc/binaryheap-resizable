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