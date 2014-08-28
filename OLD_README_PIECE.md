###~~DEPRECATED~~

You can implement the criteria you want. It's all up to you. We have to watch out for some specific cases, though. Null-objects can't be inserted to the heap. An error will be certainly throwed. However, nothing prevents you from adding a solid object which contains a null property. Let's see an example:

```javascript
var predicate = function(a, b){
    return a.relevance > b.relevance;
}

predicate({relevance: 1}, {});
predicate({relevance: 1}, {relevance: null});
```

Both `predicate()` calls right above will not result in error, since undefined and null are still comparable, producing an unpredictable behavior. It's not what most of programmers want, so, if its not what you wait from the algorithm, you should better use a deep find algorithm which throws an error if an object property is not a solid object, right inside the predicate.

In another study-case example we have:

```javascript
var predicate = function(a, b){
    return a.info.relevance > b.info.relevance;
}

predicate({info: { relevance: 1}}, {info: null});
predicate({info: { relevance: 1}}, {});
```

Now in both calls above we will notice that an error is throwed. That's because we can't access a non-existent object property. In this case, we can't access the property `relevance` of `undefined`/`null`.

So, it's up to you to control the predicate flow, to prevent errors from ocurrying if necessary or similar things using this `predicate` approach.