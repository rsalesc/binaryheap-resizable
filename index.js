/**
 * Authored by: Roberto Sales <robertosalesc@dcc.ufba.br> (rsalesc)
 * Name: binaryheap-resizable
 *
 */
var peek = require('peek');
function BinaryHeapR(capacity, predicate) {
  // handle cases where "new" keyword wasn't used
  if (!(this instanceof BinaryHeapR)) {
    return new BinaryHeapR(capacity, predicate);
  }
  if (capacity === undefined)
    throw new Error('initial capacity of binary heap must be passed');
  this._predicate_method = predicate || function (a, b) {
    return a > b;
  };
  this._predicate_deep = null;
  this._predicate_deep_default = null;
  this.size = 0;
  if (capacity instanceof Array) {
    this.data = new Array(capacity.length + 1);
    this.data[0] = null;
    this.insert(capacity);
  } else if (typeof capacity === 'number') {
    this.data = new Array(capacity + 1);
    this.data[0] = null;
  } else {
    throw new Error('initial capacity of binary heap must be passed');
  }
  this.length = this._initialLength = capacity;
  this._resizeFactor = 2;
}
BinaryHeapR.prototype.constructor = BinaryHeapR;
BinaryHeapR.prototype._predicate = function (a, b) {
  if (typeof this._predicate_deep === 'string' && this._predicate_deep.length > 0) {
    a = peek(this._predicate_deep)(a) || this._predicate_deep_default;
    b = peek(this._predicate_deep)(b) || this._predicate_deep_default;
  }
  if (typeof a === 'undefined' || typeof b === 'undefined' || a === null || b === null) {
    throw new Error('predicate member values cannot be accessed');
  }
  return this._predicate_method(a, b);
};
BinaryHeapR.prototype.resizeFactor = function (value) {
  if (value === undefined || value === null)
    return this._resizeFactor;
  this._resizeFactor = value;
};
BinaryHeapR.prototype.resize = function (new_length) {
  var data = new Array(new_length + 1);
  data[0] = null;
  for (var i = 1; i <= this.size && i <= new_length; i++) {
    data[i] = this.data[i];
  }
  this.data = data;
  this.length = new_length;
};
BinaryHeapR.prototype.push = BinaryHeapR.prototype.insert = function () {
  var i = 0;
  if (arguments.length < 1) {
    throw new Error('invalid arguments');
  }
  // check if arguments[0] is an array
  if (arguments[0] instanceof Array) {
    arguments = arguments[0];
    if (arguments.length < 1)
      return;
  }
  // check if buffer is about to be overflowed
  // expand it if its too small
  var future_size = this.size + arguments.length;
  if (future_size > this.length) {
    var future_length = Math.round(this.length * this._resizeFactor);
    this.resize(future_length > future_size ? future_length : Math.round(future_size * this._resizeFactor));
  }
  // insert accordingly to heap rules, making necessary swaps
  for (i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] !== 'undefined' && arguments[i] !== null) {
      this.data[++this.size] = arguments[i];
      var child = this.size;
      var parent = child >> 1;
      while (child > 1 && this._predicate(this.data[child], this.data[parent])) {
        this.swap(child, parent);
        child = parent;
        parent = child >> 1;
      }
    } else {
      throw new Error('null object cannot be inserted');
    }
  }
  // return number current number of items in CBuffer
  return this.size;
};
BinaryHeapR.prototype.peek = function () {
  if (this.size == 0)
    return null;
  return this.data[1];
};
BinaryHeapR.prototype.pull = BinaryHeapR.prototype.pop = function () {
  if (this.size === 0)
    return null;
  var item = this.data[1];
  this.data[1] = this.data[this.size];
  delete this.data[this.size--];
  var parent = 1;
  var child = parent << 1;
  while (child <= this.size) {
    if (child < this.size) {
      // has 2 childs
      child = this._predicate(this.data[child], this.data[child + 1]) ? child : child + 1;
    }
    if (this._predicate(this.data[parent], this.data[child]))
      break;
    this.swap(parent, child);
    parent = child;
    child = parent << 1;
    if (this.size << 1 > this._initialLength) {
      // shrink array if too big
      if (this.size < this.length / (this._resizeFactor * this._resizeFactor)) {
        this.resize(this.size << 1);
      }
    }
  }
  return item;
};
BinaryHeapR.prototype.predicate = function (fn) {
  var self = this;
  var setup = function (fn, path, def) {
    path = path || null;
    def = def || null;
    self._predicate_method = fn;
    self._predicate_deep = path;
    self._predicate_deep_default = def;
    self.reinsert();
    return self;
  };
  if (!(fn instanceof Function)) {
    // (path, def) for all
    return {
      greater: function (path, def) {
        return setup(function (a, b) {
          return a > b;
        }, path, def);
      },
      lesser: function (path, def) {
        return setup(function (a, b) {
          return a < b;
        }, path, def);
      }
    };
  }
  return {
    value: function (path, def) {
      return setup(fn, path, def);
    }
  };
};
BinaryHeapR.prototype.maxHeap = function (path, def) {
  return this.predicate().greater(path, def);
};
BinaryHeapR.prototype.minHeap = function (path, def) {
  return this.predicate().lesser(path, def);
};
BinaryHeapR.prototype.reinsert = function () {
  var old = this.data;
  var old_size = this.size;
  this.data = new Array(old.length);
  this.data[0] = null;
  this.size = 0;
  for (var i = 1; i <= old_size; i++) {
    this.insert(old[i]);
  }
};
BinaryHeapR.prototype.swap = function (a, b) {
  var tmp = this.data[a];
  this.data[a] = this.data[b];
  this.data[b] = tmp;
};
BinaryHeapR.prototype.toArray = function () {
  var array = new Array(this.size);
  for (var i = 0; i < this.size;) {
    array[i] = this.data[++i];
  }
  return array;
};
module.exports = BinaryHeapR;