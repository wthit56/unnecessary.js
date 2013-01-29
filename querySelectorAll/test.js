var parsed = document.querySelectorAll([
	"div#id.class strong ~ span",
	".class.class2[attr][attr2~='value'][attr3|=value2][attr=\"\"] > |*:first-of-type:nth-child(1)"
].join(", "));

console.log(parsed);

try {
	var json = JSON.stringify(parsed, null, 4);

	console.groupCollapsed("JSON");
	console.log(json);
	console.groupEnd();
}
catch (error) { }
