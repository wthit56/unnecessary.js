// when testing the original JavaScript functionality,
//    we'll create some proxy functions to use
if (!window.and || !window.or) {
	window.and = function (conditions) {
		var result = true;
		var i = 0, l = arguments.length;
		while (i < l) {
			result = result && arguments[i];
			i++;
		}
		return result;
	}

	window.or = function (conditions) {
		var result = false;
		var i = 0, l = arguments.length;
		while (i < l) {
			result = result || arguments[i];
			i++;
		}
		return result;
	}
}


function test(operator, a, b) {
	console.log(
	"(" + JSON.stringify(a) + " " + operator.symbol + " " + JSON.stringify(b) + ")" +
	" === " + JSON.stringify(operator.apply(this, Array.prototype.slice.call(arguments, 1)))
);
}

and.symbol = "&&";
test(and, true, true);
test(and, true, false);
test(and, false, false);
test(and, "truthy", "");
test(and, "", "truthy");
test(and, "t", 1);
test(and, 1, "t");
console.log("");

or.symbol = "||";
test(or, true, true);
test(or, true, false);
test(or, false, false);
test(or, "", "truthy");
test(or, "truthy", "");
test(or, "", 0);
test(or, 0, "");
console.log("");

console.log("((true && false) || true) === " + or(and(true, false), true));
