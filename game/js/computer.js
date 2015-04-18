// TMP set up current computer
var current_computer = {
	hostname: "mylittlepc",
	ip: "127.0.0.1",
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
					}
				]
			}
		]
	},
	running: [
		{
			id: 1,
			name: "init",
			uid: 0,
		},
		{
			id: 100,
			name: "mlsh",
			uid: 100
		},
		{
			id: 102,
			name: "sshd",
			uid: 0
		}
	],
	ports: {
		21: 102
	}
};
current_computer.current_user = current_computer.users[0];
current_computer.pwd = current_computer.root.files[0].files[0];
setUpDirectories(current_computer.root);

internet["127.0.0.1"] = current_computer;

// END TMP

function computer_printPS(pc) {
	console_print(pc.current_user.name + "@" + pc.hostname + ":");
	if (pc.pwd.path == pc.current_user.home) {
		console_print("~");
	} else {
		console_print(pc.pwd.name); // current dir	
	}
	
	console_print("$ ");
}