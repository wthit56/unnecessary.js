if (!window.console) { window.console = {}; }
if (!window.console.log) { window.console.log = function () { }; }
if (!window.console.group) { window.console.group = function (name) { window.console.log(name + "___vv"); }; }
if (!window.console.groupCollapsed) { window.console.log = function (name) { window.console.group(name); }; }
if (!window.console.groupEnd) { window.console.groupEnd = function () { window.console.log("----^^"); }; }