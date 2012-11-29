/*
a = add
b = start
c = console

e = events | repeating_fn
f = first_timer_index | timer fn
g = global
h = "splice"
i = looping index
j = timerID
k = timers
l = "length"
m = timer ms
n = next
o = "log"
p = "apply"
q = timer set
r = running | timer repeat
s = _setTimeout
t = "time"
u = timer schedule
	u i = timer schedule time
v = event | timer_fn
	v.i = v.id
	v.m = v.ms
w = timer clear
x = Array.prototype
z = ~length

-----------

I = true
O = false
N = null
D = Date

C = "call"
E = "etMilliseconds"
F = timer args

i = i
z = l
*/

(function (g, s, e, f, r, v, l, t, o, c, I, O, N, D, i, z, F) {

	g = this, s = window.setTimeout,
	e = [], f = 0,

	l = "length",
	t = "time",
	o = "log",
	p = "apply",
	h = "splice",

	c = console,

	I = true, O = false, N = null, D = Date,

	C = "call",
	E = "etMilliseconds",

	r = O,

	j = 0,
	k = {},
	x = Array.prototype
	;

	var start = new D;
	function n() {
		console.log(f, new D-start, e.map(function (v) { return v.time && (v.time-start); }));

		if (e[l] > 0) {
			v = e[0];

			if (
				(v[t] == N) ||
				(v[t] <= new D)
			) {
				e.shift()();
				/*
				try {
				e.shift()();
				}
				catch (e) {
				c.error(e.message);
				}
				*/
			}

			if (v[t] == null) {
				f--;
			}

			s(n, 0);
		}
		else {
			c[o]("* event loop stopped *");
			r = O;
		}
	}


	function b() {
		if (!r) {
			c[o]("* event loop started *");
			r = I;
			n();
		}
	}

	function a(v) {
		if (v[t] != N) {
			i = f, z = e[l];
			while (
				(i < z) &&
				(e[i][t] <= v[t])
			) { i++; }

			e[h](i, 0, v);
		}
		else {
			e[h](f, 0, v);
			f++;
		}

		b();
	}


	function q(r, f, m) {
		var i = x.slice[C](arguments, 3);

		if (r) {
			v = function e() {
				f[p](g, i);
				u(e);
			};
		}
		else if (i[l] > 0) {
			v = function () {
				f[p](g, i);
				w(f.id);
			}
		}
		else {
			v = f;
		}

		v.m = m;

		v.i = j;
		k[j] = v;
		j++;

		u(v);

		return v.i;
	};

	function u(f) {
		i = f[t] = new D;
		i["s" + E](i["g" + E]() + f.m);
		a(f);
	}

	function w(id) {
		var f = k[id];
		delete k[id];
		e[h](e.indexOf(f), 1);
	};


	g.setTimeout = function (func, delay, params) {
		i = arguments;
		x.unshift[C](i, false);
		return q[p](g, i);
	};

	g.setInterval = function (func, delay, params) {
		i = arguments;
		x.unshift[C](i, true);
		return q[p](g, i);
	};

	g.clearTimeout = g.clearInterval = w;

	g.setAsync = a;

	g.Events = e;

})();