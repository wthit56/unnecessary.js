# Event-Loop
The event loop is a tricky thing to get your head around. 
John Resig (of [jQuery](http://jquery.com/) fame) wrote a 
[great blog](http://ejohn.org/blog/how-javascript-timers-work/) 
on how the timers work, as well as a fairly straight-forward diagram showing what how 
JavaScript treats the different events that may be queued up.

Using this (and my limited knowledge on the subject), I have written the EL object, which 
allows you to .add(fn) an event to the loop, or add a timeout or interval to the loop.

The basic way I have implemented the loop is by way of a hidden `next()` function 
which looks at the first event on the top of the `events` array. If it's a regular 
event, it will execute it immediately. If it's a timer event, it checks the set execution time. 
If this time has not come yet, it ignores it continues looping until that timer event is ready. 
Otherwise it will execute the timer function.

The `next()` function will then use a `setTimeout` to call itself on the 
next _real_ event loop (this is just to prevent the whole thing locking up). So if you 
`console.log`ed out every `next()` call that is made, it would be 
running at least once a milisecond (theoreticaly).

I have also written it so if there are no more events on the stack, the loop will stop (think 
of how node stops when there's nothing going on). The loop will also be started up when a new 
event or timer is added to the stack. For now, I'm `console.log`ging out when the 
loop is closed and opened, to show you what's going on.


## script.js
So this file exposes the EL object. This includes:

`.events`: the array of events. You can inspect this or print it out how you like so you can 
see what's going on.

`.add( _fn_ )`: add a function as an immediate event to the loop. It won't actually be executed 
right away, but it'll be added to the top of the stack to be run quickly. _New events should 
really be added after any other "immediate" events, but for now it just `unshift`s 
the new event into the events array._

Some global methods are also over-written:
`setTimeout(fn, ms, args...)`, `clearTimeout(id)`,
`setInterval(fn, ms, args...)`, `clearInterval(id)`.
These work exactly the same way the regular JavaScript methods work.

> NOTE: browsers vary on how timers and immediate events take precedence over each other when 
> deciding which event should be executed next. However, to keep things simple, I've just gone 
> for immediate events go at the beginning, followed by any timer events.


## index.html
This page loads in the Unnecesary.js version (verbose.js), and runs test.js against it.


## comparison.html
This page runs test.js against the native JavaScript methods.


## test.js
This file is run in both index.html and comparison.html, and `console.log`s a number of test 
cases:

```js
setAsync(function () {
	throw new Error("(1) event loop continues even when an error is thrown");
});
```
First, we add a new event to the stack. This event will throw an error. In most cases browsers 
let the event loop even if thean error has been thrown (unless the browser's developer tools 
step in); this code is to test that the Unnecesary.js version does the same.

The event loop will simply send the error message to the console and continue execution.

```js
setAsync(function () {
	console.log("(2) async; executed");
});
```
This is our second event. It simply `console.log`s a message. This is to ensure it fires 
_after_ the first event.

```js
var interval_id = setInterval(function (arg_passed) {
	console.log("(3) interval; " + (arg_passed ? "arg passed" : "arg not passed"));
}, 1, true);
```
Next is an interval. It should run at least once (though depending on the browser and the speed 
of the browser and CPU etc., it may run up to 10 times). The argument should be passed on to the 
timer function.

```js
setTimeout(function () {
	console.log("(4) timeout; interval cleared");
	clearInterval(interval_id);
}, 10);
```
And last, we set a timeout. When executed, this will clear the previously set interval.

If all runs correctly, the messages printed to the console should be in order, with "_n_:" 
prefixing each line.

	NOTE: for the error to be shown in the log, you may have to allow "all" messages to be 
	displayed in the developer tools' settings.


##scripts

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

