var defaultListeners = {};

var Target = (function () {
	function Target(parent) {
		this._listeners = {};
		this._capturing = {};

		this.parent = parent;
	}
	Target.prototype = {
		parent: null,

		_listeners: {},
		_capturing: {},

		on: function (event, listener, useCapture) {
			var type = useCapture ? this._capturing : this._listeners;
			var listeners = type[event];
			if (!listeners) { type[event] = [listener]; }
			else { listeners.push(listener); }
		},
		trigger: function (event, data) {
			// build list of listeners
			var listeners = [];
			if (this._capturing[event]) {
				listeners = listeners.concat(this._capturing[event]);
			}
			if (this._listeners[event]) {
				listeners = listeners.concat(this._listeners[event]);
			}

			var current = this;
			while (current.parent) {
				current = current.parent;

				if (current._capturing[event]) {
					Array.prototype.unshift.apply(listeners, current._capturing[event]);
				}
				if (current._listeners[event]) {
					Array.prototype.push.apply(listeners, current._listeners[event]);
				}
			}

			// call listeners
			var e = new EventData(this, data);
			for (var i = 0, l = listeners.length; i < l; i++) {
				listeners[i](e);
				if (!e._propagate) { break; }
			}

			if (e._default && defaultListeners[event]) {
				defaultListeners[event](e);
			}
		}
	};

	var EventData = (function () {
		function EventData(target, data) {
			this.bubble = EventData.prototype.bubble;
			this.target = target;
			this.data = data;
		}
		EventData.prototype = {
			_propagate: true,
			_default: true,

			stopPropagation: function () {
				this._propagate = false;
			},
			preventDefault: function () {
				this._default = false;
			}
		};

		return EventData;
	})();

	return Target;
})();
