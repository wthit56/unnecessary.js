# Unnecesary.js

An utterly useless excercise in re-writing native JavaScript functions.

The general idea is to reverse-engineer JavaScript's inner workings, 
both to get a better understanding of how JavaScript works, 
and also to write easily-understandable code that any budding JavaScript 
code-monkey can look at and know what's going on.

While writing efficient code is ideal, this project is focussed on readability, 
and accurately recreating the functionality and quirks of how JavaScript works.

## scripts
Each Unnecesary.js recreation has 5 js files included:

### commented.js
This file is written to be easy to read. Everything flows on from each other, variable names are 
self-explanatory, and comments explain exactly what is going on and why.

This does mean, however, that the code is very inefficient. This file is meant for reading, not 
executing. You can think of it as _"pseudo-code"_, that happens to actually run.

### verbose.js
This file is written as an efficient equivalent to commented.js. It keeps the same logic, but 
moves things around to run faster and leaner than it's predecessor.

This file is used in the .html example pages.

### terse.js
This file takes verbose.js and makes the code as short as possible. Variables are 
single-characters, commonly-used property names and objects are proxied into short-named 
variables. The code is stripped down as much as possible but so that it runs exactly the same as 
the verbose.js version.

### minified.js
This file takes the terse code and strips out any unnecesary whitespace. The result is a 
hand-minified file that looks and behaves exactly like the commented.js, and therefore the 
original JavaScript method itself.

This code is efficient and as tiny as you can make it.

### test.js
This file is simply used to test the different aspects of the implementation.


## Array.sort
JavaScript's Array.sort method has some quirks to it, but is essentially pretty straight-forward 
to understand. It was interesting to figure out how sorting works.

> NOTE: browsers differ as to the sorting algorithm used. I basically wrote my own which is an 
> amalgumation of a few of the classics. It's likely not all that performant, but it gets the 
> job done, and demonstrates the issues involved nicely.

The code overwrites the native `Array.prototype.sort` method.


## Event Loop

JavaScript uses a single-threaded process with non-blocking methods (as well as a few blocking 
ones). The way timers (as in `setTimeout` or `setInterval`) work, and how they are affected by 
functions that tie up the process too long, can be hard to get your head around at first but 
again, once understood, they're pretty easy to remember and use to your advantage.

> NOTE: I couldn't find any hard evidence for this, but apparently browsers differ in how they 
> order their asynchronous callbacks and timers, etc. For the purposes of this project, I have 
> gone with async-first, followed by timer events.

The code overwrites the `setTimeout`, `clearTimeout`, `setInterval`, and `clearInterval` 
methods, as well as creating a new global method called `setAsync`, which can be used to 
demonstrate how asynchronous callbacks are inserted into the event loop, and how the execution 
of such callbacks can affected other queued events.
