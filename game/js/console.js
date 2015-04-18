var textarea;
var console_cmd = "";
var console_position = 0;

var console_cmd_position = 0; // position relative to the command
var console_state_cmd = {
	insertChar: console_cmd_insertChar,
	backspace: console_cmd_Backspace,
	del: console_cmd_Del,
	enter: console_cmd_Enter,
	left: console_cmd_Left,
	right: console_cmd_Right,
	start: console_cmd_Start,
	end: console_cmd_End
}
var console_state_wait = {
	insertChar: wait_nothing,
	backspace: wait_nothing,
	del: wait_nothing,
	enter: wait_nothing,
	left: wait_nothing,
	right: wait_nothing,
	start: wait_nothing,
	end: wait_nothing,
};
var console_pwd = "";
var console_pwd_callback;
var console_state_passwd = {
	insertChar: console_pwd_insertChar,
	backspace: console_pwd_Backspace,
	del: wait_nothing,
	enter: console_pwd_Enter,
	left: wait_nothing,
	right: wait_nothing,
	start: wait_nothing,
	end: wait_nothing,
}

var console_state = console_state_cmd;

function console_setUp() {
	textarea = $("#console");
	$(document).on('keypress', console_keyPressed);
	$(document).on('keydown', console_keyDown);
	$(document).click(console_click);
	$(document).focus(console_click);
	textarea.click(console_click);
	// disable selection
	textarea.attr("unselectable", "on");
	textarea.css("user-select", "none");
	textarea.on("selectstart", false);

	// startup computer
	textarea.val("");
	computer_printPS(current_computer);
}

function console_keyDown(event) {
	switch(event.which) {
		case 9: // tab
		case 37: // left
		case 39: // right
		case 38: // up
		case 40: // down
		case 13: // enter
		case 36: // start
		case 35: // end
		case 33: // page up
		case 34: // page down
		case 46: // delete
			event.preventDefault();
			break;
	}
	switch(event.which) {
		case 13: // enter
			console_state.enter();
			break;
		case 37: // left
			console_state.left();
			break;
		case 39: // right
			console_state.right();
			break;
		case 36: // start
			console_state.start();
			break;
		case 35: // end
			console_state.end();
			break;
		case 46: // delete
			console_state.del();
			break;
	}
}

function console_keyPressed(event) {

	// prevent some default keys
	switch(event.which) {
		case 0:
			// key not recognized
			return;
		case 8:
			// backspace
			console_state.backspace();
			return;

	}

	event.preventDefault();

	var key = String.fromCharCode(event.which);
	console_state.insertChar(key);
}
function console_click(event) {
	event.preventDefault();

	textarea.focus();
	console_updatePosition();
}

function console_insert(key) {
	textarea.insertAtCaret(key);
	console_position = textarea.prop("selectionStart");
	console_updatePosition();
}

function console_printError(text) {
	console_print(text); // TODO maybe differenciate between stdout and stderr?
}
function console_printErrln(text) {
	console_printError(text + "\n");
}

function console_print(text) {
	textarea.val(textarea.val() + text);
	// move cursor to end
	console_position = textarea.val().length;
	console_updatePosition();
}
function console_println(text) {
	console_print(text + "\n");
}
function console_updatePosition() {
	textarea.caretTo(console_position);

	// setCaretToPos(textarea, console_position);
}



function console_execute(cmd) {
	var parts = cmd.split(" ");
	if (typeof commands[parts[0]] !== 'undefined') {
		commands[parts[0]](parts);
	} else {
		console_printError("mlsh: " + parts[0] + ": command not found\n");
		console_finishedCommand(1);
	}
}
function console_finishedCommand(retVal) {  // call this when a command has finished execution
   	retVal = typeof retVal !== 'undefined' ? retVal : 0; // by default this execution was happy

	console_cmd = "";
	console_cmd_position = 0;
	computer_printPS(current_computer);
	console_state = console_state_cmd;
}



// console state: COMMAND
function console_cmd_insertChar(key) {
	// enter a command
	// TODO move cursor
	console_cmd = insertIntoString(console_cmd, key, console_cmd_position);
	console_cmd_position++;

	console_insert(key);
}
function console_cmd_Backspace() {
	if (console_cmd_position > 0) {
		console_cmd = removeBackspaces(insertIntoString(console_cmd, "\b", console_cmd_position));
		console_cmd_position--;

		textarea.insertAtCaret("\b");	
		textarea.val(removeBackspaces(textarea.val()));		
		console_position--;
		console_updatePosition();
	}
}

function console_cmd_Del() {
	if (console_cmd_Right()) {
		console_cmd_Backspace();
	}
}
function console_cmd_Enter() {
	console_print("\n");

	console_state = console_state_wait; // ignore user input
	
	console_execute(console_cmd);
}
function console_cmd_Left() {
	if (console_cmd_position > 0) {
		console_cmd_position--;
		console_position--;
		console_updatePosition();
	}
}
function console_cmd_Right() {
	if (console_cmd_position < console_cmd.length) {
		console_cmd_position++;
		console_position++;
		console_updatePosition();
		return true;
	}
	return false;
}
function console_cmd_Start() {
	console_position -= console_cmd_position;
	console_cmd_position = 0;
	console_updatePosition();
}
function console_cmd_End() {
	console_position += console_cmd.length - console_cmd_position;
	console_cmd_position = console_cmd.length;
	console_updatePosition();
}

function wait_nothing() {
	// Karpardor setzt Platscher ein... Nicht passiert
}


// console state: PASSWORD
function console_pwd_insertChar(key) {
	console_pwd += key;
}
function console_pwd_Backspace() {
	console_pwd = console_pwd.substring(0, console_pwd.length - 1);
}

function console_pwd_Enter() {
	console_print(console_pwd + "\n");
	console_state = console_state_wait;
	console_pwd_callback(console_pwd);
	console_pwd = "";
}

// set the console into the password entering state
// calls the callback function when the password is entered
function console_enterPassword(callback) {
	console.log("set callback: " + callback);
	console_pwd_callback = callback;
	console_state = console_state_passwd;
}