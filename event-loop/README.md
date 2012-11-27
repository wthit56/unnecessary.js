# Unnecesary.js

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
before increasing it. It repeats every 100 miliseconds
