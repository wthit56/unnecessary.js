var EL = (function () {
	var global = this;

	var events = [];

	var nextID = null;
	function next() {
		if (
			(events.length > 0) &&
			(
				(events[0].time == null) ||
				(events[0].time <= new Date())
			)
		) {
			try { events.shift()(); }
			finally { }
		}

		if (events.length > 0) {
			nextID = setTimeout(next, 0);
		}
		else {
			console.log("* event loop closed");
			nextID = null;
		}
	}

	var add = function (fn) {
		events.unshift(fn);

		if (events.length == 1) {
			console.log("* event loop open");
			nextID = setTimeout(next, 0);
		}
	};

	var timer = (function () {
		var timerID = 0,
			timerIDs = {};

		var i, l, wfn;
		function set(repeat, fn, ms, args) {
			// in IE, args are not forwarded to the handler
			var args = Array.prototype.slice.call(arguments, 3);

			if (repeat) {
				wfn = function timer() {
					fn.apply(global, args);
					schedule(timer);
				};
			}
			else {
				wfn = function timer() {
					fn.apply(global, args);
					clear(timer.id);
				};
			}

			wfn.ms = ms;

			// timerid
			timerID++;
			wfn.id = timerID;
			timerIDs[timerID] = fn;

			schedule(wfn, ms);

			if (!nextID) {
				console.log("* event loop open");
				nextID = setTimeout(next, 0);
			}

			return timerID;
		}
		function schedule(fn) {
			var time = new Date();
			time.setMilliseconds(time.getMilliseconds() + fn.ms);
			fn.time = time;

			// queue
			i = 0, l = events.length;
			while ((i < l) && (events[i].time <= time)) { i++; }
			events.splice(i, 0, fn);
		}

		function clear(id) {
			delete timerIDs[id];

			i = 0, l = events.length;
			while ((i < l) && (events[i].id != id)) { i++; }
			if (i < l) { events.splice(i, 1); }
		}

		return {
			set: set,
			clear: clear
		};
	})();

	return {
		events: events,

		add: add,

		setTimeout: (function () {
			var prepend = [false];
			return function setTimeout(fn, ms, args) {
				return timer.set.apply(timer, prepend.concat(Array.prototype.slice.call(arguments, 0)));
			};
		})(),
		clearTimeout: function (id) { return timer.clear(id); },

		setInterval: (function () {
			var prepend = [true];
			return function setInterval(fn, ms, args) {
				return timer.set.apply(timer, prepend.concat(Array.prototype.slice.call(arguments, 0)));
			};
		})(),
		clearInterval: function (id) { return timer.clear(id); }
	};
})();

// all async callbacks take precedence over timers in this implementation,
// although browsers vary on this point
