// when testing the original JavaScript functionality,
//    we'll create some proxy functions to use
if (!Object.prototype.and || !Object.prototype.or || !not) {

	Object.prototype.and = function (operand) {
		return (this.valueOf() && operand);
	};

	Object.prototype.or = function (operand) {
		return (this.valueOf() || operand);
	};

	window.not = function (operand) {
		return (!operand);
	};

}


console.log("true && true // " + (true).and(true));
console.log("true && false // " + (true).and(false));
console.log("false && false // " + (false).and(false));
console.log("\"truthy\" && \"\" // " + JSON.stringify(("truthy").and("")));
console.log("\"\" && \"truthy\" // " + JSON.stringify(("").and("truthy")));
console.log("\"t\" && 1 // " + JSON.stringify(("t").and(1)));
console.log("1 && \"t\" // " + JSON.stringify((1).and("t")));
console.log("");

console.log("true || true // " + (true).or(true));
console.log("true || false // " + (true).or(false));
console.log("false || false // " + (false).or(false));
console.log("\"truthy\" || \"\" // " + JSON.stringify(("truthy").or("")));
console.log("\"\" || \"truthy\" // " + JSON.stringify(("").or("truthy")));
console.log("\"\" || 0 // " + JSON.stringify(("").and(0)));
console.log("0 || \"\" // " + JSON.stringify((0).and("")));
console.log("");

console.log("((true && false) || true) // " + ((true).and(false)).or(true));
console.log("");

console.log("!true // " + not(true));
console.log("!\"truthy\" // " + not("truthy"));
console.log("!!1 // " + not(not(1)));
