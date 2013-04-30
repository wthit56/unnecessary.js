var test = new Regex(/[a-zA-Z_][a-zA-Z0-9_]+/);
test.build();
console.dir(test.parts);

//debugger;
var input = "* _a0nvidf nveiu8973947";
console.group(JSON.stringify(input));
{
	var i = 1, match;
	while (true) {
		match = test.run(input);
		console.log("match " + i + " => " + JSON.stringify(match));
		if (match == null) { break; }
		i++;
	}
}
console.groupEnd();
