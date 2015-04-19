
function cmd_ftpHack(param) {
	simpleHack(param, "ftp", 0, 1.4, 2000);
}

function readRootPw(p, s, a,b, d) {
	simpleHack(p, s, a, b, d, function(host) {
		setTimeout(function() {
			console_println("found root password: " + host.users[0].password);
			console_finishedCommand(0);
		}, Math.random() * 3000);
	});
}

function simpleHack(param, service, minVersion, maxVersion, duration, callback) {
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
					setTimeout(function() {callback(host)},duration);
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