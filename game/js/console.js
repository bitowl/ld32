var textarea;
var console_cmd = "";
var console_position = 0;

var console_cmd_position = 0; // position relative to the command
var console_state_cmd = {
	insertChar: cmd_insertChar,
	backspace: cmd_Backspace,
	del: cmd_Del,
	enter: cmd_Enter,
	left: cmd_Left,
	right: cmd_Right,
	start: cmd_Start,
	end: cmd_End
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
	console.log("down: " + event.which);
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
	
	console.log(event.which);
	console.log(String.fromCharCode(event.which));
}
function console_click(event) {
	event.preventDefault();
	console.log("clicked:" + event);

	textarea.focus();
	console_updatePosition();
}

function console_insert(key) {
	textarea.insertAtCaret(key);
	console_position = textarea.prop("selectionStart");
	console_updatePosition();
}

function console_print(text) {
	textarea.val(textarea.val()+text);
	// move cursor to end
	console_position = textarea.val().length;
	console_updatePosition();
}
function console_updatePosition() {
	textarea.caretTo(console_position);

	// setCaretToPos(textarea, console_position);
}


// console state: COMMAND
function cmd_insertChar(key) {
	// enter a command
	// TODO move cursor
	console_cmd = insertIntoString(console_cmd, key, console_cmd_position);
	console_cmd_position++;

	console_insert(key);

	console.log(console_cmd);
}
function cmd_Backspace() {
	if (console_cmd_position > 0) {
		console_cmd = removeBackspaces(insertIntoString(console_cmd, "\b", console_cmd_position));
		console_cmd_position--;

		textarea.insertAtCaret("\b");	
		textarea.val(removeBackspaces(textarea.val()));		
		console_position--;
		console_updatePosition();
	}
}

function cmd_Del() {
	if (cmd_Right()) {
		cmd_Backspace();
	}
}
function cmd_Enter() {
	console_print("\n");

	// TODO execute command
	console_print("we have EXECUTED ur command: " + console_cmd+"\n\n");
	console_cmd = "";
	console_cmd_position = 0;

	computer_printPS(current_computer);
}
function cmd_Left() {
	if (console_cmd_position > 0) {
		console_cmd_position--;
		console_position--;
		console_updatePosition();
	}
}
function cmd_Right() {
	if (console_cmd_position < console_cmd.length) {
		console_cmd_position++;
		console_position++;
		console_updatePosition();
		return true;
	}
	return false;
}
function cmd_Start() {
	console_position -= console_cmd_position;
	console_cmd_position = 0;
	console_updatePosition();
}
function cmd_End() {
	console_position += console_cmd.length - console_cmd_position;
	console_cmd_position = console_cmd.length;
	console_updatePosition();
}