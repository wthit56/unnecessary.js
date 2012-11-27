# Array.sort
This was the first piece I recreated. Over my time using JavaScript, I gradually figured out 
that it's pretty awkward to use, but once you figure it out, it can be very powerful. To fully 
explore this, I made my own sorting function, and found out a couple more oddities that I've 
done my best to faithfully recreate.

## script.js
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


## index.html
	// TODO: rewrite to make simpler


## comparison.html
	// TODO: rewrite to demonstrate original method behaviour


## sort test.html
This file reveals the way items are compared in the original JavaScript methods.

	// TODO: explain what this file is doing
