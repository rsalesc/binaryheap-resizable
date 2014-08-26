/**
 * Created by root on 25/08/14.
 */

var buffer = require('cbuffer-resizable');

function CBinaryHeap(predicate) {
// handle cases where "new" keyword wasn't used
    if (!(this instanceof CBinaryHeap)) {
        // multiple conditions need to be checked to properly emulate Array
        if (arguments.length > 1 || typeof arguments[0] !== 'number') {
            return CBinaryHeap.apply(new CBufferR(arguments.length), arguments);
        } else {
            return new CBinaryHeap(arguments[0]);
        }
    }
    this._predicate = this.predicate || function(a, b){ return a > b};
    CBufferR.prototype.constructor.apply(this, Array.prototype.slice.call(arguments, 1));
}

util.inherits(CBinaryHeap, CBufferR);

CBinaryHeap.prototype.constructor = CBinaryHeap;

CBinaryHeap.prototype.push = function(){
    var i = 0;
    // check if buffer is about to be overflowed
    var future_size = this.size + arguments.length;
    if (future_size > this.length) {
        var future_length = Math.round(this.length * this._resizeFactor);
        this.resize(future_length > future_size ? future_length : Math.round(future_size * this._resizeFactor));
    }

    // insert accordingly to heap rules, making necessary swaps
    for(i = 0; i < arguments.length; i++){
        var index = (this.end + i + 1) % this.length;
        this.data[index] = arguments[i];
        var noncircular_index = index - this.start;
        if(noncircular_index < 0) noncircular_index = this.length + noncircular_index;
        var parent = (((noncircular_index + 1) << 1) - 1 + this.start) % this.length;
        while(this._predicate(this.data[index], this.data[parent])){
            this.swap(index, parent);
            if(parent == this.start) break;
            index = parent;
            noncircular_index = index - this.start;
            if(noncircular_index < 0) noncircular_index = this.length + noncircular_index;
            parent = (((noncircular_index + 1) << 1) - 1 + this.start) % this.length;
        }
    }

    // recalculate size
    this.size += i;

    // recalculate end
    this.end = (this.end + i) % this.length;

    // return number current number of items in CBuffer
    return this.size;
};

CBinaryHeap.prototype.predicate = function(fn){
    if(!(fn instanceof Function)) return this._predicate;
    this._predicate = fn;
};