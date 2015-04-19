
function cmd_ftpHack(param) {
	simpleHack(param, "ftp", 0, 1.4, 2000);
}

function simpleHack(param, service, minVersion, maxVersion, duration) {
	var host = getHost(current_computer, param[1]);
	if (host == null) {
		console_printErrln("unknown host "+ param[1]);
		console_finishedCommand(1);
		return;
	}
	console_println("initiate hack...");
	setTimeout(function(){
		for (var i = 0; i < host.running.length; i++) {
			if (host.running[i].name == service) {
				// the server is running the affected service...
				if (host.running[i].version >= minVersion && host.running[i].version <= maxVersion) {

					console_println("hack successfull");
					console_finishedCommand();
					return;
				} else {
					console_printErrln("could not connect to target service.");
					console_finishedCommand(1);			
					return;
				}
			}
		};
		console_printErrln("could not connect to target service.");
		console_finishedCommand(1);
	},duration); // TODO change with internet speed

}