var start_time = new Date();
function render() {
	console.log(
		Events.first_timer_index,
		Events.length,
		new Date() - start_time,
		Events.map(function (v) { return v.ms; })
	);
}


var interval = { value: 0 };
var iID = setInterval(function (interval) {
	console.log("interval", interval.value);
	interval.value++;
}, 100, interval);

setTimeout(function (r) {
	console.log("timeout", r);
	clearInterval(iID);
}, 1000, Math.random());

setTimeout(function () {
	//throw new Error("Event Loop should continue running, even though this error is thrown.");
}, 500);

window.onclick = function (e) {
	setAsync(function () {
		console.log("window.onclick", e.pageX, e.pageY);
		setTimeout(function () { console.log("window.onclick +1000ms", new Date().getTime()); }, 1000);
		setTimeout(function () { console.log("window.onclick +1010ms", new Date().getTime()); }, 1010);
	});
};
