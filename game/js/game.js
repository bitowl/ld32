function setUp() {


 	if (typeof(Storage) == "undefined") {
 		alert("We need local storage to save your progress.");
 	}



 	var test={kekse:[{test:"hai"},2,3,4]};

 	test.kekse.push("wow");
 	alert(JSON.stringify(test));
 	alert(JSONE.stringify(test));


 	if (localStorage.internet == null) {
 		console.log("SET UP INTERNETZ");
 		internet_setUp();
	} else {
 		if (confirm("Load old save")) {
 			console.log(localStorage.internet);
 			internet = JSONE.parse(localStorage.internet);


 			// fix all roots
 			for (pc in internet) {
 				internet[pc].root.parent = null;
 			}

 			// console.log(internet["127.0.0.1"].pwd);
 			console.log(internet);
 			// alert(localStorage.current_pc);
 			current_computer = internet[localStorage.current_pc];
 			alert("startup complete");
 		}
 	}


	console_setUp();
}

function saveGame() {
	localStorage.internet = JSONE.stringify(internet);
	console.log(localStorage.internet);
	console.log(JSONE.from);
	console.log(internet["127.0.0.1"].pwd);
	localStorage.current_pc = current_computer.ip;
}