
var BinaryHeapR = require('../');
var expect = require('chai').expect;

describe("BinaryHeapR", function(){

    describe("constructor", function(){

        it("should return always an instanceof BinaryHeapR", function(){
            expect(new BinaryHeapR(2)).to.be.an.instanceof(BinaryHeapR);
            expect(BinaryHeapR(2)).to.be.an.instanceof(BinaryHeapR);
        });

        it("should throw an error when capacity is not passed", function(){
            expect(BinaryHeapR).to.throw(/initial capacity/i);
        });

        it("should instantiate object where data length must be capacity + 1", function(){
            expect(BinaryHeapR(2).data).to.have.length(3);
        });

        it("should instantiate object where predicate is always set", function(){
            expect(BinaryHeapR(2)).to.have.property('predicate').that.is.an.instanceof(Function);
            expect(BinaryHeapR(2, function(){})).to.have.property('predicate').that.is.an.instanceof(Function);
        });

        it("should instantiate object from array elements", function(){
            expect(BinaryHeapR([1, 2, 3]).data).to.deep.equals([null, 3, 1, 2]);
        });
    });
    describe("data management", function(){

        describe("insert(), push()", function(){
            var heap = BinaryHeapR(2);

            it("should throw if no argument is passed", function(){
                expect(heap.insert).to.throw(/invalid arguments/i);
            });

            it("should do nothing if an empty array is passed as parameter", function(){
                expect(function(){ heap.insert([])}).to.not.throw(Error);
                expect(heap.data).to.deep.equals([null]);
            });

            it("should insert single element", function(){
                heap.insert(5);

                expect(heap.data).to.deep.equals([null, 5]);
            });

            it("should insert element and reorder if necessary", function(){
                heap.insert(11);

                expect(heap.data).to.deep.equals([null, 11, 5]);
            });

            it("should expand the heap when its full using #resizeFactor", function(){
                heap.insert(8);
                expect(heap.data).to.deep.equals([null, 11, 5, 8]);

                heap.insert([1, 2, 3, 4, 5, 6]);
                expect(heap.data).to.have.length(19); // 9 * resizeFactor + 1 = 9 * 2 + 1
            });

            var multiheap = BinaryHeapR(3);

            it("should insert multiple elements to the heap", function(){
                multiheap.insert(1, 2, 3);

                expect(multiheap.data).to.deep.equals([null, 3, 1, 2]);

                multiheap.insert([4, 5]);

                expect(multiheap.data).to.deep.equals([null, 5, 4, 2, 1, 3]);
            });

            it("should throw when null object is trying to be inserted", function(){
                var fn = function(){
                    multiheap.insert([null, 0, null]);
                };

                expect(fn).to.throw(/null object/i);
            });
        });

        describe("peek()", function(){
            var heap = BinaryHeapR(2);

            it("should return null if heap is empty", function(){
                expect(heap.peek()).to.be.null;
            });

            it("should get the first heap element", function(){
                heap.insert([5, 10, 4]);
                expect(heap.peek()).to.equals(10);
            });
        });

        describe("pull()", function(){
            var heap = BinaryHeapR(4);

            it("should return peek and remove peeked data(if not null) from heap", function(){
                expect(heap.pull()).to.be.null;
                expect(heap.data).to.deep.equals([null]);

                heap.insert([1, 4, 3, 5]);
                expect(heap.pull()).to.equals(5);
                expect(heap.data).to.deep.equals([null, 4, 1, 3]);
            });
        });
    });

    describe("size", function(){
        var heap = BinaryHeapR(2);

        it("should tell how many real heap elements are on the heap", function(){
            heap.insert([1, 2, 3, 4, 5]);
            expect(heap.size).to.equals(5);
        });
    });

    describe("resize()", function(){
        var heap = BinaryHeapR(2);

        it("should resize array and conserve data order", function(){
            heap.insert(1, 2);
            heap.resize(3);

            expect(heap.data).to.deep.equals([null, 2, 1]);

            heap.resize(1);

            expect(heap.data).to.deep.equals([null, 2]);
        });

    });

    describe("toArray()", function(){
        var heap = BinaryHeapR(5);

        it("should return a real binary heap array", function(){
            heap.insert([5, 11, 8]);

            expect(heap.toArray()).to.deep.equals([11, 5, 8]);
        });
    });

    describe("reinsert()", function(){
        var heap = BinaryHeapR(4);

        it("should reallocate array keeping the values intact", function(){
            heap.insert([5, 3, 1]);
            heap.reinsert();
            expect(heap.data).to.deep.equals([null, 5, 3, 1]);
        });
    });

    describe("predicate()", function(){
        var heap = BinaryHeapR(2);
        var fn = function(a, b){ return a > b };

        describe("value()", function(){
            it("should return `this` object", function(){
                expect(heap.predicate(fn).value()).to.equals(heap);
            });
        });

        it("should compare raw values when deep is not set", function(){
            var wrap = function(){
                return heap._predicate(5, 1);
            };
            expect(wrap()).to.be.ok;
            expect(wrap).to.not.throw(/predicate member values/i);
        });

        it("should throw when comparing raw values with deep set", function(){
            heap.predicate(fn).value("relevance");
            expect(function(){ heap._predicate(5, 1)}).to.throw(/predicate member values/i);
        });

        it("should not throw when comparing raw values with deep set but default isset", function(){
            heap.predicate(fn).value("relevance", 1);
            expect(function(){ heap._predicate(5, 1)}).to.not.throw(/predicate member values/i);
        });

        it("should compare complex objects", function(){
            heap = BinaryHeapR(2).predicate(fn).value("relevance.priority", 1);
            var obj1 = {relevance: { priority: 2 }};
            var obj2 = {};
            var obj3 = {relevance: { priority: 0 }};

            expect(heap._predicate(obj1, obj2)).to.be.ok;
            expect(heap._predicate(obj3, obj2)).to.not.be.ok;
        });

        describe("greater()", function(){
            it("should generate greater predicate", function(){
                heap = BinaryHeapR(2).predicate().greater();

                expect(heap._predicate(5, 1)).to.be.ok;
            });
        });

        describe("lesser()", function(){
            it("should generate lesser predicate", function(){
                heap = BinaryHeapR(2).predicate().lesser();

                expect(heap._predicate(1, 5)).to.be.ok;
            });
        });
    });

});