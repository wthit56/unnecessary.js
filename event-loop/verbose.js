(function () {

	var global = this,
		_setTimeout = global.setTimeout;

	var events = [];
	events.first_timer_index = 0;

	var event,
		running = false;

	function next() {
		if (events.length > 0) {
			event = events[0];

			if (
				(event.time == null) ||
				(event.time <= new Date())
			) {
				try {
					events.shift()();
				}
				catch (error) {
					console.error(error.message);
				}
			}

			if (event.time == null) {
				events.first_timer_index--;
			}

			_setTimeout(next, 0);
		}
		else {
			console.log("* event loop stopped *");
			running = false;
		}
	}


	function start() {
		if (!running) {
			console.log("* event loop started *");
			running = true;
			_setTimeout(next, 0);
		}
	}

	var add = (function () {
		var i, l;

		return function add(event) {
			if (event.time != null) {
				i = events.first_timer_index, l = events.length;
				while (
				(i < l) &&
				(events[i].time <= event.time)
			) { i++; }

				events.splice(i, 0, event);
			}
			else {
				events.splice(events.first_timer_index, 0, event);
				events.first_timer_index++;
			}

			start();
		};
	})();

	var timer = (function () {
		var timerID = 0,
			timers = {};

		var set = (function () {
			var args, timer_fn;

			return function set(repeat, fn, ms, args) {
				args = Array.prototype.slice.call(arguments, 3);

				if (repeat) {
					timer_fn = function repeating_fn() {
						fn.apply(global, args);
						schedule(repeating_fn);
					};
				}
				else {
					timer_fn = function once_fn() {
						fn.apply(global, args);
						timers[once_fn.id];
					}
				}

				timer_fn.ms = ms;

				timer_fn.id = timerID;
				timers[timerID] = timer_fn;
				timerID++;

				schedule(timer_fn);

				return timer_fn.id;
			};
		})();

		function schedule(fn) {
			var time = fn.time = new Date();
			time.setMilliseconds(time.getMilliseconds() + fn.ms);
			add(fn);
		}

		var clear = (function () {
			var fn, event_index;

			return function clear(id) {
				fn = timers[id];
				delete timers[id];

				event_index = events.indexOf(fn);
				if (event_index !== -1) {
					events.splice(event_index, 1);
				}
			};
		})();

		return {
			set: set,
			clear: clear
		};
	})();


	global.setTimeout = function (func, delay, params) {
		Array.prototype.unshift.call(arguments, false);
		return timer.set.apply(global, arguments);
	};

	global.setInterval = function (func, delay, params) {
		Array.prototype.unshift.call(arguments, true);
		return timer.set.apply(global, arguments);
	};

	global.clearTimeout = global.clearInterval = timer.clear;

	global.setAsync = add;

	global.Events = events;

})();