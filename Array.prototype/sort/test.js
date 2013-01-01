
console.log([3, 2, 1].sort());
console.log([5, 10].sort());
console.log([20, 3].sort(function (a, b) { return a - b; }));
console.log([{ v: 3 }, { v: 2 }, { v: 1}].sort(function (a, b) { return a.v - b.v; }).map(function (v) { return v.v; }));
console.log([2, 5, 4, 3, 1].sort(function (a, b) { return a - b; }));
