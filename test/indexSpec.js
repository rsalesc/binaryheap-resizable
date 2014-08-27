
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

    describe("predicate()", function(){

        it("should return a function if no function is passed as parameter", function(){
            var heap = BinaryHeapR(1);
            expect(heap.predicate()).to.be.an.instanceof(Function);
        });
    });

});