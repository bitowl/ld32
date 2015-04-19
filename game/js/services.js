function cmd_service(params, flag, process, pc) {
	console.log(params);
	console.log(flag);
	console.log(process);
	console.log(pc);

	if (params.length == 0) {

		console_finishedCommand(1);
		return;
	}
	if (params[1] == "start") {
		var file = getFileByAbsolutePath("/bin/services/" + params[2], pc.root);
		if (file == null) {
			console_printErrln("service: " + params[2] + ": service not found");
			console_finishedCommand(1);
			return;
		}

		var process = {
			id: pc.pid++,
			uid: 0,
			name: params[2],
			kill: wait_nothing, // TODO service killing routine
			interrupt: wait_nothing
		}
		pc.running[process.id] = process;

		file.process = process;
		if (file.cmd(pc, process, true)) {
			console_println("service " + params[2] + " started.");
		} else {
			delete pc.running[process.id];
			console_printErrln("service " + params[2] + " could not be started.");
		}

		
	} else if (params[1] == "stop") {
		var file = getFileByAbsolutePath("/bin/services/" + params[2]);
		if (file == null) {
			console_printErrln("service: " + params[2] + ": service not found");
			console_finishedCommand(1);
			return;
		}
		if (file.process == null) {
			console_printErrln("service: " + params[2] + ": service is not running");
			console_finishedCommand(1);
			return;
		}
		delete pc.running[file.process.id];
		// delete this process
		file.cmd(pc, file.process, false);
		console_println("service " + params[2] + " stopped.");
	} else {
		console_printErrln("service: " + params[1] + ": command unknown");
		console_finishedCommand(1);
		return;
	}
	console_finishedCommand();
}

function init_service(pc, service) {
	console.log("initializing service " + service);
	var file = getFileByAbsolutePath("/bin/services/" + service, pc.root);
	if (file == null) {
		console.log("service: " + service + ": service not found");
		return;
	}

	var process = {
		id: pc.pid++,
		uid: 0,
		name: service,
		version: file.version,
		kill: wait_nothing, // TODO service killing routine
		interrupt: wait_nothing
	}
	pc.running[process.id] =process;

	file.process = process;
	if (!file.cmd(pc, process, true)) {
		delete pc.running[process.id];
		console.log("service " + service + " could not be started.");
	}
	
}

function svc_bealake(pc, process, start) {
	if (start) {
		return (bindPort(pc, process.id, 80) && bindPort(pc, process.id, 443));
	}else {
		unbindPort(pc, process.id, 80);
		unbindPort(pc, process.id, 443);
	}
}
function svc_ftp(pc, process, start) {
	if (start) {
		return bindPort(pc, process.id, 21);
	} else {
		unbindPort(pc, process.id, 21);
	}
}
function svc_ssh(pc, process, start) {
	if (start) {
		return bindPort(pc, process.id, 22);
	} else {
		unbindPort(pc, process.id, 22);
	}
}
function svc_mail(pc, process, start) {
	if (start) {
		process.mail = function(u,s,f,c,a) {real_sendMail(pc,u,s,f,c,a);}
		return bindPort(pc, process.id, 25) && bindPort(pc, process.id, 110) && bindPort(pc, process.id, 143);
	} else {
		unbindPort(pc, process.id, 25);
		unbindPort(pc, process.id, 110);
		unbindPort(pc, process.id, 143);
	}
}

function real_sendMail(pc,user, subject, from, content, callback)  {
			for (var i = 0; i < pc.users.length; i++) {
				console.log(pc.users[i]);
				if(pc.users[i].name == user) {
					var dir = getFileByAbsolutePath(createPath(pc.users[i].home,"mails"), pc.root);
					if (dir == null) {
						callback("user has no home directory");
						return;
					}

					dir.files.push({
						name: new Date().getTime()+"-"+from.split("@")[0],
						content: "Date: " + new Date() + "\n\
From: " + from +"\n\
To: " + user + "@" +pc.ip+"\n\
Content-Type: text/plain\n\
Subject: " + subject+ "\n\
\n\
" + content,
parent:dir});

					if (current_computer == pc && current_computer.current_user == pc.users[i]) {
						console_println("\nmail: you got new mail. use the mail command to read the newest.")
					}
					callback("mail send");
					return;
				}
			}
			callback("User " + user +" not found");
		}

function sendMail(user, host, subject, from, content, callback) {
	if (internet[host] == null) {
		callback("host "+host+" not found");
		return;
	}
	var pc = internet[host];
	if (pc.ports[25] != null) {
		setTimeout(function() {
			pc.running[pc.ports[25]].mail(user, subject, from, content, callback);
		}, getPing(current_computer.ping, 100) * 200);
	} else {
		callback("no Mailserver found");
		return;
	}
}