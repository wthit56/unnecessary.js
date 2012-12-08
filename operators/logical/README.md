# Operators\Equality

This code simulates how logical operators work internally. Implemented are the following:

`&&` (`and`): loop through each operand and return the first falsy value, or returns the last 
operand (which will be truthy).

`||` (`or`): loop through eahc operand and return the first truthy value, or returns the last 
operand (which will be falsy).

The rules I've used in writing these functions are based on those outlined here: 
[Mozilla Developer Network: Expressions and Operators](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Expressions_and_Operators)


## Tests

At the top of the test.js, I check to see if the `and` and `or` functions exist. If 
we're in index.html, and testing the Unnecesary.js version, then these will be the Unnecesary.js 
versions. Otherwise, we create proxy functions with the same names, so that the tests still run 
okay.

```js
test(and, true, true); // true
test(and, true, false); // false
test(and, false, false); // false
test(and, "truthy", ""); // ""
test(and, "", "truthy"); // ""
test(and, "t", 1); // 1
test(and, 1, "t"); // "t"
```
The lines above test the `and` operator.

```js
test(or, true, true);
test(or, true, false);
test(or, false, false);
test(or, "", "truthy");
test(or, "truthy", "");
test(or, "", 0);
test(or, 0, "");
```
These lines test the `or` operator.

```js
console.log("((true && false) || true) === " + or(and(true, false), true));
```
This final line does a composition of `and` and `or` operators. Just as the regular operators 
can be grouped and nested within each other, the Unnecesary.js versions can, too.
