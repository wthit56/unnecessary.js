// when testing the original JavaScript functionality,
//    we'll create some proxy functions to use
if (!equal || !strictEqual) {
	function equal(a, b) {
		return a == b;
	}

	function strictEqual(a, b) {
		return a === b;
	}
}

var test = (function () {
	function toString(value) {
		if (typeof (value) === "number") { return value.toString(); }
		else { return JSON.stringify(value); }
	}
	return function test(a, method, b) {
		console.log(
			"(" + toString(a) + " " + method.operator + " " + toString(b) + ")" +
			" // returns " + method(a, b)
		);
	};
})();


// equal tests
equal.operator = "==";
console.log(equal.operator + "\n");

test(+"NaN", equal, +"NaN");

test(1, equal, 1); // true
test(1, equal, 2); // false
test(true, equal, true); // true
test(true, equal, false); // false
test("string", equal, "string"); // true
test("string", equal, "other string"); // false
console.log("");

test(1, equal, true); // true
test(1, equal, false); // false
test(1, equal, "1"); // true
test(1, equal, "2"); // false
test("[object Object]", equal, {}); // true (in some browsers)
console.log("");

// see test.js source for more information on this test
test("object string", equal, {
	value: "object string",
	toString: function () { return this.value; }
}); // true
console.log("");

var a = { value: 1 },
	b = { value: 2 };

test(a, equal, a); // true
test(a, equal, b); // false

// strict equal tests
strictEqual.operator = "===";
console.log("\n\n" + strictEqual.operator + "\n");

test(1, strictEqual, 1); // true
test(1, strictEqual, "1"); // false
test(1, strictEqual, 2); //false
