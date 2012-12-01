
function test(a, method, b) {
	console.log(
		"(" + JSON.stringify(a) + " " + method.operator + " " + JSON.stringify(b) + ")" +
		" // returns " + method(a, b)
	);
}

// equal tests
equal.operator = "==";

test(1, equal, 1);
test(1, equal, 2);
test(true, equal, true);
test(true, equal, false);
test("string", equal, "string");
test("string", equal, "other string");

test(1, equal, true);
test(1, equal, false);
test(1, equal, "1");
test(1, equal, "2");
test("[object Object]", equal, {});
test("object string", equal, {
	value: "object string",
	// note: "see test.js source for more information on this test",
	toString: function () { return this.value; }
});

var a = { value: true },
	b = { value: false };

test(a, equal, a);
test(a, equal, b);

// strict equal tests
strictEqual.operator = "===";
test(1, strictEqual, 1);
test(1, strictEqual, "1");
test(1, strictEqual, 2);
