
setAsync(function () {
	throw new Error("1: event loop continues even when an error is thrown");
});

setAsync(function () {
	console.log("2: async; executed");
});

var interval_id = setInterval(function (arg_passed) {
	console.log("3: interval; " + (arg_passed ? "arg passed" : "arg not passed"));
}, 1, true);

setTimeout(function () {
	console.log("4: timeout; interval cleared");
	clearInterval(interval_id);
}, 10);
