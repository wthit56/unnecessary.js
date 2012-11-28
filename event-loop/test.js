
var interval = { value: 0 };
var iID = setInterval(function (interval) {
	console.log("interval", interval.value);
	interval.value++;
}, 100, interval);

setTimeout(function (r) {
	console.log("timeout", r);
	clearInterval(iID);
}, 1000, Math.random());

window.onclick = function (e) {
	EL.add(function () {
		console.log("window.onclick", e.pageX, e.pageY);
		setTimeout(function () { console.log("window.onclick +1000ms", new Date().getTime()); }, 1000);
		setTimeout(function () { console.log("window.onclick +1010ms", new Date().getTime()); }, 1010);
	});
};
