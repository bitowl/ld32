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
			kill: wait_nothing,
			interrupt: wait_nothing
		}
		pc.running.push(process);

		file.process = process;
		file.cmd(pc, process, true);


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
		}
		// delete this process
		file.cmd(pc, file.process, false);
	}
	console_finishedCommand();
}

function svc_bealake(pc, process, start) {
	if (start) {
		bindPort(pc, process.id, 80);
		bindPort(pc, process.id, 443);
	}else {
		unbindPort(pc, process.id, 80);
		unbindPort(pc, process.id, 443);
	}
}