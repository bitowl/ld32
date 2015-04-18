var textarea;
var console_state = 0;
var console_cmd = "";
var console_position;

function console_setUp() {
	textarea = $("#console");
	$(document).on('keypress', console_keyPressed);
	$(document).on('keydown', console_keyDown);
	$(document).click(console_click);
	textarea.click(console_click);
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
			event.preventDefault();

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
			return;

	}


	event.preventDefault();


	var key = String.fromCharCode(event.which);
	switch (console_state) {
		case 0:
			// enter a command
			// TODO move cursor
			console_cmd += key;
			textarea.insertAtCaret(key);
			break;
	}

	console.log(event.which);
	console.log(String.fromCharCode(event.which));
}
function console_click(event) {
	event.preventDefault();
	console.log("clicked:" + event);

	textarea.focus();
	setCaretToPos(textarea, console_position);
}

function console_insert(text) {
	textarea.insertAtCaret(key);
	console_position = textarea.prop("selectionStart");
}
