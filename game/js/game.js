function setUp() {
 	if (typeof(Storage) == "undefined") {
 		alert("We need local storage to save your progress.");
 	}

	console_setUp();

	// console.log(localStorage.getItem("internet") + (localStorage.getItem("internet") == null));
 	if (localStorage.getItem("internet") == null) {
 		// first start
 		startFirstGame();

	} else {
		console.log("load previous game");
		// load previous session

		internet = JSONE.parse(localStorage.getItem("internet"));
		accounts = JSONE.parse(localStorage.getItem("accounts"));
		tutorial = JSONE.parse(localStorage.getItem("tutorial"));

		// fix all roots
		for (pc in internet) {
			internet[pc].root.parent = null;
		}

		current_computer = internet[localStorage.getItem("current_pc") ];


		// run
		computer_printPS(current_computer);
 	}

}


function startFirstGame() {
	createWorld();
	console_print("Username: ");
	console_enterText(function(username) {
		console_print("Password: ");
		console_enterPassword(function(passwd){
			console_println("Login successful.\n");
			setTimeout(function() {
				var seed = getRandom(Math.random());
				var ownPC = generateOwnPC(seed, username, passwd);
				computer_connect(ownPC, ownPC.users[1]);
				computer_printPS(current_computer);
				console_state = console_state_cmd;
				sendTrigger(TRIGGER_WELCOME_MAIL, [username, ownPC.ip]);
			},700);
			

		});
	});
}


function saveGame() {
	localStorage.setItem("internet",JSONE.stringify(internet));
	localStorage.setItem("accounts",JSONE.stringify(accounts));
	localStorage.setItem("tutorial",JSONE.stringify(tutorial));
	localStorage.setItem("current_pc",current_computer.ip);
}
