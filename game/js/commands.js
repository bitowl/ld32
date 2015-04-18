var commands = {
	pwd: cmd_pwd,
	cd: cmd_cd,
	ls: cmd_ls,
	dir: cmd_ls,
	sleep: cmd_sleep
}
function cmd_pwd(param) {
	console_print(current_computer.pwd.path+"\n");
	console_finishedCommand();
}
function cmd_cd(param) {
	console_finishedCommand();
}
function cmd_ls(param) {
	var fileNames = Array();
	var dir = current_computer.pwd; // TODO maybe there is a parameter 
	console.log(current_computer);
	for (var i = 0; i < dir.files.length; i++) {
		fileNames.push(dir.files[i].name);
	}
	console.log(fileNames);
	fileNames.sort();
	console.log(fileNames);

	for (var i = 0; i < fileNames.length; i++) {
		console_println(fileNames[i]);
	}
	console_finishedCommand();
}
function cmd_sleep(param) {
	if (param.length == 1) {
		console_printError("sleep: missing operand\n");
		console_finishedCommand(1);
	} else if (isNaN(param[1])) {
		console_printError("sleep: invalid time interval '" + param[1] + "'\n");
		console_finishedCommand(1);
	} else {
		setTimeout(function() {
			console_finishedCommand();
		}, param[1] * 1000);
	}
}