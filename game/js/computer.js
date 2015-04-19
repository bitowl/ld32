// TMP set up current computer
/* var current_computer = {
	hostname: "mylittlepc",
	ip: "127.0.0.1",
	pc: 0,
	users: [
		{
			id: 100,
			name: "bitowl",
			password: "superkekse",
			groups: [
				"users", "sudoers"
			],
			path: ["/bin"],
			home: "/home/bitowl"
		},
		{
			id: 0,
			name: "root",
			password: "notreallyhard",
			groups: [
			],
			path: ["/bin", "/sbin"],
			home: "/root"
		}
	],
	pwd: null,
	init:["mail"],
	root: {
		directory: true,
		name: "/",
		path: "/",
		parent: null,
		files: [
			{
				directory: true,
				name: "home",
				files: [
					{
						directory: true,
						name: "bitowl",
						files:[
							{
								directory: true,
								name: "pr0n",
								files: [
									{
										executable: true,
										name: "ftpH4xx0r",
										cmd: cmd_ftpHack
									}
								]
							}
						]
					}
				]
			},
			{
				directory: true,
				name: "bin",
				files:[
					{
						executable: true,
						name:"ls",
						cmd: function(p,f) {cmd_ls(p,f);}
					},
					{
						executable: true,
						name: "pwd",
						cmd: function(p,f) {cmd_pwd(p,f);}
					},
					{
						executable: true,
						name: "cat",
						cmd: function(p,f) {cmd_cat(p,f);}
					},
					{
						executable: true,
						name: "rm",
						cmd: function(p,f) {cmd_rm(p,f);}
					},
					{
						executable: true,
						name: "cd",
						cmd: function(p,f) {cmd_cd(p,f);}
					},
					{
						executable: true,
						name: "cp",
						cmd: function(p,f) {cmd_cp(p,f);}
					},
					{
						executable: true,
						name: "scp",
						cmd: function(p,f) {cmd_scp(p,f);}
					},
					{
						executable: true,
						name: "ssh",
						cmd: function(p,f) {cmd_ssh(p,f);}
					},
					{
						executable: true,
						name: "ps",
						cmd: function(p,f) {cmd_ps(p,f);}
					},
					{
						executable: true,
						name: "nmap",
						cmd: function(p,f) {cmd_nmap(p,f);}
					},
					{
						executable: true,
						name: "service",
						cmd: cmd_service
					},
					{
						executable: true,
						name: "save",
						cmd: cmd_save
					},
					{
						directory: true,
						name: "services",
						files: [
							{
								name: "bealake",
								cmd: svc_bealake,
								version: 3.14
							},
							{
								name: "mail",
								cmd: svc_mail,
								version: 2.1
							}
						]
					}
				]
			}
		]
	},
	running: {},
	ports: {}
};
current_computer.current_user = current_computer.users[0];
current_computer.pwd = "/home/bitowl";//current_computer.root.files[0].files[0].path;
*/

// internet["127.0.0.1"] = current_computer;

// END TMP

function boot(pc) {
	setUpDirectories(pc.root);

	pc.running[1] = {
		id: 1,
		name: "init",
		uid: 0,
	};
	pc.pid = 2;

	for (var i = 0; i < pc.init.length; i++) {
		init_service(pc, pc.init[i]);
	};
}

function computer_printPS(pc) {
	console_print(pc.current_user.name + "@" + pc.hostname + ":");
	if (pc.pwd == pc.current_user.home) {
		console_print("~");
	} else {
		console_print(getPwd(pc).name); // current dir	
	}
	
	console_print("$ ");
}

function computer_connect(pc, user){
	current_computer = pc;
	current_computer.current_user = user;
	current_computer.pwd = user.home;
	// TODO start mlsh process
}

function computer_exec(pc, uid, cmd ,fg) {
	var parts = cmd.split(" ");

	if (parts[0] == "") {
		console_finishedCommand();
		return;
	}

	var file;
	if (parts[0].indexOf("/") > -1) {
		// local file
		file = getFile(getPwd(pc), parts[0], pc.root);
	} else {
		for (var i = 0; i < pc.current_user.path.length; i++) {
			file = getFileByAbsolutePath(createPath(pc.current_user.path[i], parts[0]),pc.root);
			if (file != null) {
				break; // we found it
			}
		};
		
	}
	if (file == null) {
		console_printErrln("mlsh: " + parts[0] + ": No such file or directory");
		console_finishedCommand(1);
	} else {
		if (file.directory) {
			console_printErrln("mlsh: " + parts[0] + ": Is a directory");
			console_finishedCommand(1);
		} else if (!file.executable) {
			console_printErrln("mlsh: " + parts[0] + ": Permission denied");
			console_finishedCommand(1);
		} else {
			// THIS FILE REALLY IS AN EXECUTABLE \ö/

			var params = Array(parts[0]);
			var flags = Array();
			for (var i = 1; i < parts.length; i++) {
				if (parts[i].startsWith("-")) {
					flags.push(parts[i].replace(/-/g,''));
				} else {
					params.push(parts[i]);
				}
			};
			console.log("p: " + params+" f: "+flags);
			var process = {
				id: pc.pid++,
				uid: uid,
				name: params[0],
				kill: wait_nothing,
				interrupt: wait_nothing
			}
			pc.running[process.id] = process;
			
			if (fg) {
				pc.current_user.fgPid = process.id;
				console.log(pc.current_user);
			}
			file.cmd(params, flags, process, pc);
		}
	}

}

function getPwd(pc) {
	console.log("get pwd for " + pc.ip);
	var pwd= getFileByAbsolutePath(pc.pwd, pc.root);
	console.log("pwd: "+pwd.path);
	return pwd;
}

function bindPort(pc, pid, port) {
	if (typeof pc.ports[port] != 'undefined') {
		return false;
	}
	pc.ports[port] = pid;
	return true;
}
function unbindPort(pc, pid, port) {
	if (pc.ports[port] == pid) {
		delete pc.ports[port];
	}
}

//boot(current_computer);
// boot(pc1);

