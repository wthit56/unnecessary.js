# Operators\Equality

This code simulates type coercion in equality operators. Implemented are the following:

`==` (`equal`): if the types are the same compare values; otherwise, convert one of the values 
into the same type as the other.

`!=` (`notEqual`): just returns an the inverted value of the `equal` function (true becomes 
false and vis versa). For this reason, there aren't any tests for this method.

`===` (`strictEqual`): if the types are different, or the values are different, returns false; 
otherwise, returns true.

`!==` (`notStrictEqual`): again, returns the inverted value of the `strictEqual` function, and 
so is not tested.

The rules I've used in writing these functions are based on those outlined here: 
[Mozilla Developer Network: Expressions and Operators](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Expressions_and_Operators)


## Tests

At the top of the test.js, I check to see if the `equal` and `strictEqual` functions exist. If 
we're in index.html, and testing the Unnecesary.js version, then these will exist. Otherwise, 
we create proxy functions with the same name, so that the tests still run okay.

```js
test(1, equal, 1); // true
test(1, equal, 2); // false
test(true, equal, true); // true
test(true, equal, false); // false
test("string", equal, "string"); // true
test("string", equal, "other string"); // false
```
The above are all comparing values of the same type, so no type coercion is necessary.

```js
test(1, equal, true); // true
test(1, equal, false); // false
test(1, equal, "1"); // true
test(1, equal, "2"); // false
test("[object Object]", equal, {}); // true (in some browsers)
```
These compare values of different types, and so one of the values. The last test should work in 
most browsers, but this is only because of the way most JavaScript engines convert an object 
into a string. I doubt "[object Object]" is actually in the spec, though.

```js
// see test.js source for more information on this test
test("object string", equal, {
	value: "object string",
	toString: function () { return this.value; }
}); // true
```
As one of the operands is a string, the other operand is converted into a string. As the other 
operand is an object, it's `.toString()` method is called. This has been set up to return 
"object string", which is equal to the other operand. And so, the function returns true.
