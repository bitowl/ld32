// TMP set up current computer
var current_computer = {
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
	init:[],
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
						files:[]
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
						cmd: cmd_ls
					},
					{
						executable: true,
						name: "pwd",
						cmd: cmd_pwd
					},
					{
						executable: true,
						name: "cat",
						cmd: cmd_cat
					},
					{
						executable: true,
						name: "rm",
						cmd: cmd_rm
					},
					{
						executable: true,
						name: "cd",
						cmd: cmd_cd
					},
					{
						executable: true,
						name: "cp",
						cmd: cmd_cp
					},
					{
						executable: true,
						name: "scp",
						cmd: cmd_scp
					},
					{
						executable: true,
						name: "ssh",
						cmd: cmd_ssh
					},
					{
						executable: true,
						name: "ps",
						cmd: cmd_ps
					},
					{
						executable: true,
						name: "service",
						cmd: cmd_service
					},
					{
						directory: true,
						name: "services",
						files: [
							{
								name: "bealake",
								cmd: svc_bealake
							}
						]
					}
				]
			}
		]
	},
	running: [],
	ports: {
		21: 102
	}
};
current_computer.current_user = current_computer.users[0];
current_computer.pwd = current_computer.root.files[0].files[0];


internet["127.0.0.1"] = current_computer;

// END TMP

function boot(pc) {
	setUpDirectories(pc.root);

	pc.running.push({
		id: 1,
		name: "init",
		uid: 0,
	});
	pc.pid = 2;

	for (var i = 0; i < pc.init.length; i++) {
		computer_exec(pc, pc.users[0].id, pc.init[i]);
	};
}

function computer_printPS(pc) {
	console_print(pc.current_user.name + "@" + pc.hostname + ":");
	if (pc.pwd.path == pc.current_user.home) {
		console_print("~");
	} else {
		console_print(pc.pwd.name); // current dir	
	}
	
	console_print("$ ");
}

function computer_exec(pc, uid, cmd) {
	var parts = cmd.split(" ");
	var file;
	if (parts[0].startsWith("./") || parts[0].startsWith("/")) {
		// local file
		file = getFile(pc.pwd, parts[0]);
	} else {
		for (var i = 0; i < pc.current_user.path.length; i++) {
			file = getFileByAbsolutePath(createPath(pc.current_user.path[i], parts[0]));
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
			pc.running.push(process);
			
			pc.current_user.fgPid = process.id;
			console.log(pc.current_user);
			file.cmd(params, flags, process, pc);
		}
	}

}

function bindPort(pc, port, pid) {
	if (typeof pc.ports[port] != 'undefined') {
		return false;
	}
	pc.ports[port] = pid;
	return true;
}

boot(current_computer);
boot(pc1);