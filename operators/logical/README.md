# Operators\Equality

This code simulates how logical operators work internally. Implemented are the following:

`&&` (`(value).and(value)`): loop through each operand and return the first falsy value, or returns the last 
operand (which will be truthy).

`||` (`(value).or(value)`): loop through eahc operand and return the first truthy value, or returns the last 
operand (which will be falsy).

`!` (`not(value)`): return the inverted truthiness of the given value. This operator always 
returns a boolean value, and so can be used to convert a value into a boolean, using a 
double-not (`!!"truthy" // true`).

The rules I've used in writing these functions are based on those outlined here: 
[Mozilla Developer Network: Expressions and Operators](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Expressions_and_Operators)


## Tests

At the top of the test.js, I check to see if the `and` and `or` functions exist. If 
we're in index.html, and testing the Unnecesary.js version, then these will be the Unnecesary.js 
versions. Otherwise, we create proxy functions with the same names, so that the tests still run 
okay.

```js
console.log("true && true // " + (true).and(true));
console.log("true && false // " + (true).and(false));
console.log("false && false // " + (false).and(false));
console.log("\"truthy\" && \"\" // " + JSON.stringify(("truthy").and("")));
console.log("\"\" && \"truthy\" // " + JSON.stringify(("").and("truthy")));
console.log("\"t\" && 1 // " + JSON.stringify(("t").and(1)));
console.log("1 && \"t\" // " + JSON.stringify((1).and("t")));
```
The lines above test the `and` operator.

```js
console.log("true || true // " + (true).or(true));
console.log("true || false // " + (true).or(false));
console.log("false || false // " + (false).or(false));
console.log("\"truthy\" || \"\" // " + JSON.stringify(("truthy").or("")));
console.log("\"\" || \"truthy\" // " + JSON.stringify(("").or("truthy")));
console.log("\"\" || 0 // " + JSON.stringify(("").and(0)));
console.log("0 || \"\" // " + JSON.stringify((0).and("")));
```
These lines test the `or` operator.

```js
console.log("((true && false) || true) // " + ((true).and(false)).or(true));
```
This line does a composition of `and` and `or` operators. Just as the regular operators 
can be grouped and nested within each other, the Unnecesary.js versions can, too.

```js
console.log("!true // " + not(true));
console.log("!\"truthy\" // " + not("truthy"));
console.log("!!1 // " + not(not(1)));
```
These final lines test the `not` function.
