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

> NOTE: browsers vary on how timers and immediate events take precedence over each other when 
> deciding which event should be executed next. However, to keep things simple, I've just gone 
> for immediate events go at the beginning, followed by any timer events.


## Tests

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

> NOTE: for the error to be shown in the log, you may have to allow "all" messages to be 
> displayed in the developer tools' settings.

