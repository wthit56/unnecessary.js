## event-loop
The event loop is a tricky thing to get your head around. 
John Resig (of [jQuery](http://jquery.com/) fame) wrote a 
[great blog](http://ejohn.org/blog/how-javascript-timers-work/) 
on how the timers work, as well as a fairly straight-forward diagram showing what how 
JavaScript treats the different events that may be queued up.

Using this (and my limited knowledge on the subject), I have written the EL object, which 
allows you to .add(fn) an event to the loop, or add a timeout or interval to the loop.

The basic way I have implemented the loop is by way of a hidden <cite>next()</cite> function 
which looks at the first event on the top of the <cite>events</cite> array. If it's a regular 
event, it will execute it immediately. If it's a timer event, it checks the set execution time. 
If this time has not come yet, it ignores it continues looping until that timer event is ready. 
Otherwise it will execute the timer function.

The <cite>next()</cite> function will then use a <cite>setTimeout</cite> to call itself on the 
next _real_ event loop (this is just to prevent the whole thing locking up). So if you 
<cite>console.log</cite>ed out every <cite>next()</cite> call that is made, it would be 
running at least once a milisecond (theoreticaly).

I have also written it so if there are no more events on the stack, the loop will stop (think 
of how node stops when there's nothing going on). The loop will also be started up when a new 
event or timer is added to the stack. For now, I'm <cite>console.log</cite>ging out when the 
loop is closed and opened, to show you what's going on.


### script.js
So this file exposes the EL object. This includes:

**.events**: the array of events. You can inspect this or print it out how you like so you can 
see what's going on.

**.add(_fn_)**: add a function as an immediate event to the loop. It won't actually be executed 
right away, but it'll be added to the top of the stack to be run quickly. _New events should 
really be added after any other "immediate" events, but for now it just <cite>unshift</cite>s 
the new event into the events array._

**.setTimeout(fn, ms, args), .clearTimeout(id), .setInterval(fn, ms, args), .clearInterval(id)**: 
works exactly the same way the regular JavaScript methods work.

> NOTE: browsers vary on how timers and immediate events take precedence over each other when 
> deciding which event should be executed next. However, to keep things simple, I've just gone 
> for immediate events go at the beginning, followed by any timer events.


### index.html
This page runs some examples against the EL object, <cite>console.log</cite>ging out messages 
along the way to show you how things are working.

    var interval = { value: 0 };
    var iID = EL.setInterval(function (interval) {
	    console.log("interval", interval.value);
	    interval.value++;
    }, 100, interval);

This code sets a new interval that will <cite>console.log</cite> the passed-in interval's value 
before increasing it. It repeats every 100<abbr title="miliseconds">ms</abbr>. The returned 
timerID is stored in the iID variable for later use.

	EL.setTimeout(function (r) {
		console.log("timeout", r);
		EL.clearInterval(iID);
	}, 1000, Math.random());

A new timeout is then created, to be executed in 1000<abbr title="miliseconds">ms</abbr>. When 
executed, this timer will clear the previously set interval. This means the interval will be run 
9 times and then stop.

	window.onclick = function (e) {
		EL.add(function () {
			console.log("window.onclick", e.pageX, e.pageY);
			EL.setTimeout(function () { console.log("window.onclick +1000ms", new Date().getTime()); }, 1000);
			EL.setTimeout(function () { console.log("window.onclick +1010ms", new Date().getTime()); }, 1010);
		});
	};

These final lines setup an onclick input event. It will <cite>console.log</cite> the fact that 
it's been triggered, and then create two timeouts 1000 and 1010<abbr title="miliseconds">ms</abbr> 
into the future. It then packages all this up into a function and adds it as an event into the 
loop. This means the loop will be opened, or kept open until those timeouts are called.


### comparison.html
This file is a line-for-line copy of index.html, but uses the native JavaScript methods instead. 
Using this file, you make sure the implementations behave the same.
