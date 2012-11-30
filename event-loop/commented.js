(function () {
	// this will be used as the context for added events
	//    in the browser for example, this will be the window object
	var global = this;

	// store the original setTimeout
	//    we will use this later to schedule events in JavaScript itself
	var _setTimeout = window.setTimeout;

	// this array will hold all scheduled events,
	//     in the order in which they should be executed
	//     (also referred to as the "stack")
	var events = [];
	// this property will track where the timer events begin
	var first_timer_index = 0;

	// this will track whether the event loop is in motion or not
	var running = false;

	// this function will execute the first event in the events array
	function next() {
		// events are queued in the stack
		if (events.length > 0) {
			// get the first event from the stack
			var event = events[0];

			// event has no set execution time...
			if (event.time == null) {
				// ...so remove the first event from the stack...
				var event = events.shift();

				// prevent the event loop from failing if any errors occur
				try {
					// ...and execute it
					event();
				}
				// when an error is thrown...
				catch (error) {
					// ...send the message to the console
					console.error(error.message);
				}

				// there is 1 less regular (non-timer) event in the stack
				first_timer_index--;
			}
			// event has a set execution time
			//     and the time has passed...
			else if (event.time <= new Date()) {
				// ...so remove the first event from the stack...
				var event = events.shift();

				// prevent the event loop from failing if any errors occur
				try {
					// ...and execute it
					event();
				}
				// when errors are thrown...
				catch (error) {
					// send the message to the console
					console.error(error.message);
				}
			}

			// schedule next iteration of event loop
			_setTimeout(next, 0);
		}
		// no events in the stack
		else {
			console.log("* event loop stopped *");
			// loop is no longer running
			running = false;
		}
	}

	// start the event loop into motion
	function start() {
		// loop is not already running...
		if (!running) {
			console.log("* event loop started *");
			// loop is now running
			running = true;
			// ...so start the loop
			_setTimeout(next, 0);
		}
	}

	// add an event into the stack
	function add(event) {
		// the event has a set exeution time (from setTimeout or setInterval)
		if (event.time != null) {
			// find correct position in events array
			// starting from first_timer_index...
			//    (the index of the first timer in the stack)
			var i = first_timer_index;
			while (
			// ...loop through all events in the stack...
				(i < events.length) &&
			// ...while current event's execution time is earlier than or equal to 
			//    the new event's execution time
				(events[i].time <= event.time)
			) {
				// move on to next event
				i++;
			}

			// insert the new event into stack
			//    at the found position
			events.splice(i, 0, event);
		}
		// the event is not a timer event
		else {
			// insert the new event into the stack
			//    after all other scheduled events
			events.splice(first_timer_index, 0, event);

			// as we've added the new event before the first timer event,
			//    the first timer will have an index 1 higher than before
			first_timer_index++;
		}

		// make sure the event loop is running
		start();
	}


	// store the timer id to be used next
	var timerID = 0;
	// a lookup object for all active timers
	var timers = {};

	// create a new timer
	function timer_set(repeat, fn, ms, args) {
		// retreive arguments to be passed through to the handler
		var args = Array.prototype.slice.call(arguments, 3);

		// timer is to repeat
		//    (setInterval)
		if (repeat) {
			// create a new function
			var timer_fn = function repeating_fn() {
				//debugger;
				// apply the captured arguments to the 
				//    original handler function
				fn.apply(global, args);
				// re-schedule the timer to be run again
				timer_schedule(repeating_fn);
			};
		}
		// timer should not repeat
		//     (setTimeout)
		else {
			// there are captured arguments...
			if (args.length > 0) {
				// create a new function
				var timer_fn = function () {
					// apply captured arguments to the 
					//    original handler function
					fn.apply(global, args);
					// as this is a run-once setTimeout timer,
					//    we can remove it from the timers lookup object
					delete timers[timer_fn.id];
				}
			}
			// there are no captured arguments...
			else {
				// ...so use the original function
				var timer_fn = fn;
			}
		}

		// set ms property on the timer function
		timer_fn.ms = ms;

		// set id property on the timer function
		timer_fn.id = timerID;
		// store timer function in lookup object
		timers[timerID] = timer_fn;
		// increase timer id for next new timer
		timerID++;

		// schedule the timer function
		timer_schedule(timer_fn);

		// return timer's id
		//    this will be used for clearing the timer if necessary
		return timer_fn.id;
	}

	function timer_schedule(fn) {
		// get current time
		var time = new Date();
		// add timer's miliseconds to the time,
		time.setMilliseconds(time.getMilliseconds() + fn.ms);
		// the variable "time" is now "ms" into the future

		// set timer function's execution time
		fn.time = time;

		// add timer function to the stack
		add(fn);
	}

	function timer_clear(id) {
		// retrieve timer function from lookup object...
		var fn = timers[id];
		// ...and remove it
		delete timers[id];

		// find index of the timer function in the stack...
		var event_index = events.indexOf(fn);
		// ...and if found...
		if (event_index !== -1) {
			// ...remove it
			events.splice(event_index, 1);
		}
	}


	// overwrite JavaScript's native setTimeout method
	global.setTimeout = function (func, delay, params) {
		// add an argument to the arguments list
		// this will correspond to the "repeat" argument in timer_set
		Array.prototype.unshift.call(arguments, false);
		// call timer_set and return the resulting timer id
		return timer_set.apply(global, arguments);
	};

	// overwrite JavaScript's native clearTimeout method
	global.clearTimeout = function (timeoutID) {
		// use timer_clear to clear the relevant timer event
		timer_clear(timeoutID);
	};

	// overwrite JavaScript's native setInterval method
	global.setInterval = function (func, delay, params) {
		// add an argument to the arguments list
		// this will correspond to the "repeat" argument in timer_set
		Array.prototype.unshift.call(arguments, true);
		// call timer_set and return the resulting timer id
		return timer_set.apply(global, arguments);
	};

	// overwrite JavaScript's native clearTimeout method
	global.clearInterval = function (timeoutID) {
		// use timer_clear to clear the relevant timer event
		timer_clear(timeoutID);
	};

	// expose a new method, setAnync
	global.setAsync = function (func) {
		// add the passed-in function to the event loop
		add(func);
	};

	global.Events = events;

})();