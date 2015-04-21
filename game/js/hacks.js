
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
function downGrade(p, s, a, b, d, version) { // uses an exploit to downgrade the version of a software
	simpleHack(p, s, a, b, d, function(host) {
		var file = getFileByAbsolutePath("/bin/services/" + s, host.root);
		if (file == null) {
			console_printErrln("could not find executable");
			console_finishedCommand(1);
			return;
		}
		console_println("vulnerable program found. downgrading...")
		setTimeout(function() {
			file.version = version;
			console_println(service + " on "+ host.ip + " is now on "+ version);
			console_finishedCommand(0);
		}, Math.random() * 7000);
	});	
}

function pwCracker(p,s,a,b,d, strength) {
	if (p.length != 3) {
		console_printErrln(p[0] + " USER HOST");
		console_finishedCommand(1);
		return;
	}
	var user = p[1];
	p.splice(1,1);
	simpleHack(p, s, a, b, d, function(host) {
		for (var i = 0; i < host.users.length; i++) {
			if (host.users[i].name == user) {
				var ustr = getPasswordStrength(host.users[i].password);
				if (ustr < strength) {
					setTimeout(function() {
						console_println("password for " + user +" found:");
						console_println(host.users[i].password);
						console_finishedCommand(0);
					}, Math.random()*(ustr-strength)*100);
					return;
				}
				break;
			}
		}
		setTimeout(function() {
			console_printErrln("no success");
			console_finishedCommand(1);
		}, Math.random()*5000);

	});
}

function userGrabber(p, s, a, b, d) { 
	simpleHack(p, s, a, b, d, function(host) {
		for (var i = 0; i < host.users.length; i++) {
			console_println(host.users[i].name);
		}
		console_finishedCommand(0);
	});
}

function startService(p, s, a, b, d) {
	if (p.length != 3) {
		console_printErrln(p[0]+" HOST SERVICE");
		console_finishedCommand(1);
		return;
	}
	simpleHack(p, s, a, b, d, function(host) {
		if (init_service(host, p[2])) {
			console_println("service successfully started");
			console_finishedCommand(0);	
		} else {
			console_printErrln("service "+p[2]+ " could not be started on "+host.ip);
			console_finishedCommand(1);	
		}
		
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
		for (i in host.running) {
			// console.log(host.running);
			// console.log(i);
			if (host.running[i] != null && host.running[i].name == service) {
				// the server is running the affected service...
				if (host.running[i].version >= minVersion && host.running[i].version <= maxVersion) {
					setTimeout(function() {callback(host)},duration);
					return;
				} else {
					console_printErrln("could not connect to target service. wrong version.");
					console_finishedCommand(1);			
					return;
				}
			}
		};
		console_printErrln("could not connect to target service.");
		console_finishedCommand(1);
	},duration); // TODO change with internet speed

}
