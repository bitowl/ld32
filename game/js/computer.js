// TMP set up current computer
var current_computer = {
	ps: "bitowl@mylittlepc:",
	pwd: null,
	root: {
		directory: true,
		name: "/",
		path: "/",
		parent: null,
		files: []
	}
};

var home = newDirectory(current_computer.root, "home");
var bitowl = newDirectory(home, "bitowl");
current_computer.pwd = bitowl;
var test = newFile(bitowl, "test");
var zeugs = newDirectory(bitowl, "zeugs");
var kekse = newFile(zeugs, "kekse");
var ld32 = newDirectory(bitowl, "ld32");

// END TMP

function computer_printPS(pc) {
	console_print(pc.ps);
	console_print(pc.pwd.name); // current dir
	console_print("$ ");
}