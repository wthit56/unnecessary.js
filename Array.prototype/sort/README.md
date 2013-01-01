# Array.sort
This was the first piece I recreated. Over my time using JavaScript, I gradually figured out 
that it's pretty awkward to use, but once you figure it out, it can be very powerful. To fully 
explore this, I made my own sorting function, and found out a couple more oddities that I've 
done my best to faithfully recreate.


## How does is work?
First, let's talk about the compareFunction. A function can be passed in to Array.sort() to be 
used as a basis for comparing two values in the array. These are passed in as two parameters, 
often labelled as "a" and "b". If it returns a negative number, the function is saying that "a" 
should be to the _left_ of "b"; if it returns a positive number, the function is saying that "a" 
should be to the _right_ of "b". If 0 is returned, the values are deemed equal, and so shouldn't 
be rearranged.

If no compareFunction passed in a default one is used, which compares the two values as though 
they were strings. This is fine when the values _are_ strings, but cause problems if not.

> For example, <cite>[5, 10].sort()</cite> gives us <cite>[10, 5]</cite>. This is because "10" is less than 
> "5".

So looping through each item, the current and next items are compared using the compareFunction. 
If the returned number is positive, we swap the positions of item "a" and "b" with each other, 
using a simple splice call.

Then we have to loop back through the previous item, comparing to it's new item ("b" from 
earlier). We keep doing this until we find "b"'s true sorted position in the array. This uses 
the same compareFunction.

Then we just return the array, and we're done.


## Tests

```js
[3, 2, 1].sort();
```
This code will sort the array correctly using the default alphabetical compareFunction.

```js
[5, 10].sort();
```
This code demonstrates the buggy output when using the default compareFunction.

```js
[20, 3].sort(function (a, b) { return a - b; });
```
This code will correctly sort the array by passing in a compareFunction which compares "a" and 
"b" as numbers.

```js
[{ v: 3 }, { v: 2 }, { v: 1 }].sort(function (a, b) { return a.v - b.v; }).map(function (v) { return v.v; })
```
This code creates a number objects, and uses a compareFunction to compare properties within 
these objects. The result is then mapped to just output the values sorted on.

```js
[2, 5, 4, 3, 1].sort(function (a, b) { return a - b; });
```
This code demonstrates the need for recursing back through the array to correctly place a moved 
item.


## reverse-engineering.html
This file reveals the way items are compared in the original JavaScript methods.

It creates objects with a `.toString` method attached, which will `console.log` it's value, 
as well as a randomly-generated identifier. It shows how the sorting and comparison is done 
for each item.
