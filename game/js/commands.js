var commands = {
	pwd: cmd_pwd,
	cd: cmd_cd,
	ls: cmd_ls,
	dir: cmd_ls,
	sleep: cmd_sleep,
	echo: cmd_echo,
	rm: cmd_rm,
}
function cmd_pwd(param) {
	console_println(current_computer.pwd.path);
	console_finishedCommand();
}
function cmd_cd(param) {
	if (param.length == 1) {
		// TODO go home
	} else { // enter the directory first given
		var dir = getFile(current_computer.pwd, param[1]);

		if (dir == null) {
			console_printErrln("cd: " + param[1] + ": No such file or directory");
			console_finishedCommand(1);
			return;
		} else if (dir.directory == false) {
			console_printErrln("cd: " + param[1] + ": Not a directory");
			console_finishedCommand(1);
			return;
		} else {
			current_computer.pwd = dir;
		}
	}

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
function cmd_rm(param) {
	// TODO seperate into flags and arguments

	if (param.length == 1) {
		console_printErrln("rm: missing operand");
		console_finishedCommand(1);
	} else {
		var retVal = 0;
		for (var i = 1; i < param.length; i++) {

			var file = getFile(current_computer.pwd, param[i]);
			console.log("delete: "+file+" "+param[i]+" "+i);
			if (file == null) {
				console_printErrln("rm: cannot remove '" + param[i] + "': No such file or directory");
				retVal = 1;
			} else {
				// TODO if directory only remove if -r flag given
				// TODO when deleting recursively test that the pwd is not in that path

				// search file in parent
				for (var j = 0; j < file.parent.files.length; j++) {
					if (file.parent.files[j] == file) {
						file.parent.files.splice(j, 1);
						break;
					}
				}
			}
		}
		console_finishedCommand(retVal);
	}
}
function cmd_sleep(param) {
	if (param.length == 1) {
		console_printErrln("sleep: missing operand");
		console_finishedCommand(1);
	} else if (isNaN(param[1])) {
		console_printErrln("sleep: invalid time interval '" + param[1] + "'");
		console_finishedCommand(1);
	} else {
		setTimeout(function() {
			console_finishedCommand();
		}, param[1] * 1000);
	}
}

function cmd_echo(param) {
	var string = "";
	for (var i = 1; i < param.length; i++) {
		string += param[i] + " ";
	}
	console_println(string);
	console_finishedCommand();
}

