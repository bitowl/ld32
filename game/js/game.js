function setUp() {
	console_setUp();

 	if (typeof(Storage) == "undefined") {
 		alert("We need local storage to save your progress.");
 	}
}