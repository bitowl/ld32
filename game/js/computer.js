// TMP set up current computer
var current_computer = {
	hostname: "mylittlepc",
	users: [
		{
			name: "bitowl",
			password: "superkekse",
			groups: [
				"users", "sudoers"
			],
			home: "/home/bitowl"
		},
		{
			name: "root",
			password: "notreallyhard",
			groups: [
			],
			home: "/root"
		}
	],
	pwd: null,
	root: {
		directory: true,
		name: "/",
		path: "/",
		parent: null,
		files: []
	}
};
current_computer.current_user = current_computer.users[0];

var home = newDirectory(current_computer.root, "home");
var bitowl = newDirectory(home, "bitowl");
current_computer.pwd = bitowl;
var test = newFile(bitowl, "test");
var zeugs = newDirectory(bitowl, "zeugs");
var kekse = newFile(zeugs, "kekse");
var ld32 = newDirectory(bitowl, "ld32");

// END TMP

function computer_printPS(pc) {
	console_print(pc.current_user.name + "@" + pc.hostname + ":");
	if (pc.pwd.path == pc.current_user.home) {
		console_print("~");
	} else {
		console_print(pc.pwd.name); // current dir	
	}
	
	console_print("$ ");
}