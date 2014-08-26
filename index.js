/**
 * Created by root on 25/08/14.
 */

var util = require('util');

function BinaryHeapR(capacity, predicate) {
// handle cases where "new" keyword wasn't used
    if (!(this instanceof BinaryHeapR)) {
       return new BinaryHeapR(capacity, predicate);
    }

    this._predicate = predicate || function(a, b){ return a > b};

    this.data = new Array(capacity + 1);
    this.data[0] = null;

    this.length = this._initialLength = capacity;
    this.size = 0;
    this._resizeFactor = 2;
}

BinaryHeapR.prototype.constructor = BinaryHeapR;

BinaryHeapR.prototype.resizeFactor = function(value){
    if(value === undefined || value == null) return this._resizeFactor;
    this._resizeFactor = value;
};

BinaryHeapR.prototype.resize = function(new_length){
    var data = new Array(new_length + 1);
    data[0] = null;
    for(var i = 1; i <= this.size && i <= new_length; i++){
        data[i] = this.data[i];
    }
    this.data = data;
    this.length = new_length;
};

BinaryHeapR.prototype.push = BinaryHeapR.prototype.insert = function(){
    var i = 0;
    // check if buffer is about to be overflowed
    // expand it if its too small
    var future_size = this.size + arguments.length;
    if (future_size > this.length) {
        var future_length = Math.round(this.length * this._resizeFactor);
        this.resize(future_length > future_size ? future_length : Math.round(future_size * this._resizeFactor));
    }

    // insert accordingly to heap rules, making necessary swaps
    for(i = 0; i < arguments.length; i++){
        this.data[++this.size] = arguments[i];
        var child = this.size;
        var parent = child >> 1;
        while(child > 1 && this._predicate(this.data[child], this.data[parent])){
            this.swap(child, parent);
            child = parent;
            parent = child >> 1;
        }
    }

    // return number current number of items in CBuffer
    return this.size;
};

BinaryHeapR.prototype.pop = BinaryHeapR.prototype.pull = function(){
    if(this.size === 0) return null;

    var item = this.data[1];
    this.data[1] = this.data[this.size];
    delete this.data[this.size--];

    var parent = 1;
    var child = parent << 1;
    while(child <= this.size){
        if(child < this.size){  // has 2 childs
            child = this._predicate(this.data[child], this.data[child + 1]) ? child : child + 1;
        }

        if(this._predicate(this.data[parent], this.data[child])) break;
        this.swap(parent, child);

        parent = child;
        child = parent << 1;

        if(this.size << 1 > this._initialLength) {
            // shrink array if too big
            if (this.size < this.length / (this._resizeFactor * this._resizeFactor)) {
                this.resize(this.size << 1);
            }
        }

        return item;
    }
};

BinaryHeapR.prototype.predicate = function(fn){
    if(!(fn instanceof Function)) return this._predicate;
    this._predicate = fn;
};

BinaryHeapR.prototype.swap  = function(a, b){
    var tmp = this.data[a];
    this.data[a] = this.data[b];
    this.data[b] = tmp;
};

BinaryHeapR.prototype.toArray = function(){
    var array = new Array(this.size);
    for(var i = 0; i < this.size; ){
        array[i] = this.data[++i];
    }
    return array;
};

module.exports = BinaryHeapR;