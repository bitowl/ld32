var current_computer = {
	ps: "bitowl@mylittlepc:"
};

function computer_printPS(pc) {
	console_print(pc.ps);
	console_print("/home"); // current dir
	console_print("$ ");
}