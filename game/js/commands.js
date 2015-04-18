var commands = {
	pwd: cmd_pwd,
	cd: cmd_cd,
	ls: cmd_ls,
	dir: cmd_ls,
	sleep: cmd_sleep,
	echo: cmd_echo,
	rm: cmd_rm,
	passwd: cmd_passwd,
	rand: cmd_rand,
	seed: cmd_seed,
	ping: cmd_ping,
	ssh: cmd_ssh,
	exit: cmd_exit,
	nmap: cmd_nmap,
}
function cmd_pwd(param) {
	console_println(current_computer.pwd.path);
	console_finishedCommand();
}
function cmd_cd(param) {
	if (param.length == 1) {
		current_computer.pwd = getFileByAbsolutePath(current_computer.current_user.home);
		console_finishedCommand();
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




function cmd_hostname(param) {
	if (param.length == 1) {
		console_println(current_computer.hostname);
		console_finishedCommand();
	} else {
		// TODO check for root
		current_computer.hostname = param[1];
		console.console_finishedCommand();
	}
}
function cmd_passwd(param) {
	console_println("Changing password for " + current_computer.current_user.name);
	console_print("(current) password: ");
	console_enterPassword(function(passwd) {
		console.log("callback called");
		if (passwd == current_computer.current_user.password) {
			console_print("Enter new password: ");
			console_enterPassword(function(passwd) {
				tmp = passwd;
				console_print("Retype new password: ");		
				console_enterPassword(function(passwd) {
					if (tmp == passwd) {
						current_computer.current_user.password = passwd;
						tmp = null;
						console_println("passwd: password updated successfully");
						console_finishedCommand();
					} else {
						console_printErrln("Sorry, passwords do not match");
						console_printErrln("passwd: password unchanged");
						console_finishedCommand(1);
					}
				});
			});
		} else {
			console_printErrln("passwd: Authentication failure");
			console_printErrln("passwd: password unchanged");
			console_finishedCommand(1);
		}
	});
}




var cmd_rand_seed = null;
function cmd_rand(param) {
	if (cmd_rand_seed == null) {
		console_printErrln("rand: you have to initialize the randomness with seed");
		console_finishedCommand(1);
	}
	console_println("your number: " + random(cmd_rand_seed));
	console_println("rand ip: " + getRandomIP(cmd_rand_seed));
	console_finishedCommand();
}
function cmd_seed(param) {
	var seed = parseInt(param[1]);
	if (isNaN(seed)) {
		seed = Math.random();
	}
	cmd_rand_seed = getRandom(seed);
	console_println("initialized random with " + seed);
	console_finishedCommand();
}
function cmd_ping(param) {
	var ip = param[1]; // TODO check

	if (typeof internet[ip] == 'undefined') {
		console_printErrln("ping: unknown host " + ip);
		console_finishedCommand();
		return;
	}

	console_println("PING " + ip + " 56(84) bytes of data.");
	var time = 1 + Math.random(); 
	setTimeout(function() {
		ping_callback(1, ip, time);
	}, time);
}
function ping_callback(icmp_seq, ip, time) {
	console_println("64 bytes from " + ip + ": icmp_seq=" + icmp_seq +" ttl=56 time="+time+" ms");
	if (icmp_seq < 4) {
		var time = 1 + Math.random(); 
		setTimeout(function() {
			ping_callback(++icmp_seq, ip, time);
		}, time);
	} else {
		// print statistics
		console_println("--- " + ip +" ping statistics ---");
		console_println("4 packets transmitted, 4 received, 0% packet loss");
		// TODO calculate roundtriptimes
		console_finishedCommand();
	}
}
function cmd_ssh(param) {
	var userhost = param[1];
	var user = current_computer.current_user.name;
	var host = "127.0.0.1";
	if (userhost.indexOf("@") < 0) {
		// it's only a hostname
		host = userhost;
	} else {
		var parts = userhost.split("@");
		user = parts[0];
		host = parts[1];
	}

	if (typeof internet[host] == 'undefined') {
		console_printErrln("ping: unknown host " + host);
		console_finishedCommand(1);
		return;
	}

	// TODO check if there is an ssh server running

	console_print("Password: ");
	console_enterPassword(function(passwd){ssh_callback(1, user, internet[host], passwd);});
}

function ssh_callback(tries, user, pc, passwd) {
	for (var i = 0; i < pc.users.length; i++) {
		if (pc.users[i].name == user) {
			if (pc.users[i].password == passwd) {
				ssh_stack.push(current_computer.ip);
				// correct password				
				current_computer = pc;
				current_computer.current_user = pc.users[i];
				current_computer.pwd = getFileByAbsolutePath(pc.users[i].home);
				if (current_computer.pwd == null) {
					console_printErrln("Folder " + pc.users[i].home + " not found.");
					// TODO close ssh connection
					ssh_close(1);
					return;
				}

				// ssh connection successfully established
				

				console_finishedCommand();
				return;
			}
			break;
		}
	}
	// it wasn't right
	if (tries < 3) {
		console_print("Password: ");
		console_enterPassword(function(passwd){ssh_callback(++tries, user, pc, passwd);});
	} else {
		console_printErrln("Received disconnect from " + pc.ip + ": Too many authentication failures for " +user);	
		console_printErrln("Disconnected from " + pc.ip);
		console_finishedCommand(1);
	}
	
}

function cmd_exit(param) {
	// TODO if we are on another system, exit the ssh-connection
	if (ssh_stack.length == 0) {
		console_printErrln("You cannot leave now. The world needs you!");
		console_finishedCommand(1);
	} else {
		ssh_close(0)
	}
}
function ssh_close(retVal) {
	// jump back to the last pc we were on
	var jumpTo = ssh_stack.pop();
	console_println("Connection to " + current_computer.ip + " closed.");
	current_computer = internet[jumpTo];
	console_finishedCommand(retVal);	
}


function cmd_nmap(param) {
	var host = getHost(param[1]);
	if (host == null) {
		console_finishedCommand(1);
		return;
	}

	console_println("Starting Nmap");
	setTimeout(function(){nmap_results(host)}, 1000); // TODO depend on connection speed
}
function nmap_results(host) {
	console_println("Nmap scan report for " + host.ip);
	console_println("PORT   STATE SERVICE");
	for (port in host.ports) {
		console_println(portMeanings[port]);
	}
	console_finishedCommand();
}
function cmd_cat(param) {
	if (param.length == 1) {
		console_printErrln("cat: missing operand");
		console_finishedCommand(1);
		return;
	}
	var file = getFile(current_computer.pwd, param[1]);
	if (file == null) {
		console_printErrln("cat: " + param[1] + ": No such file or directory");
		console_finishedCommand(1);
	} else {
		if (file.directory) {
			console_printErrln("cat: " + param[1] + ": Is a directory");
			console_finishedCommand(1);
		} else if (file.executable) {
			console_printErrln("cat: " + param[1] + ": Cannot print an executable");
			console_finishedCommand(1);
		} else {
			// this is a file with content
			console_println(file.content);
			console_finishedCommand();
		}
	}
}