function cmd_service(params, flag, process, pc) {
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
		pc.running.push(process);

		file.process = process;
		if (file.cmd(pc, process, true)) {
			console_println("service " + params[2] + " started.");
		} else {
			pc.running.splice(pc.running.length-1,1);
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
		for (var i = 0; i < pc.running.length; i++) {
			if (pc.running[i] == file.process) {
				pc.running.splice(i, 1);
				break;
			}
		}
		// delete this process
		file.cmd(pc, file.process, false);
		console_println("service " + params[2] + " stopped.");
	} else {
		console_printErrln("service: " + param[1] + ": command unknown");
		console_finishedCommand(1);
		return;
	}
	console_finishedCommand();
}

function init_service(pc, service) {
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
	pc.running.push(process);

	file.process = process;
	if (!file.cmd(pc, process, true)) {
		pc.running.splice(pc.running.length-1,1);
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