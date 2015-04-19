var internet = { // THE INTERNET :O
}


var pc1 = {
		hostname: "masterserver",
		ip: "1",
		users: [
			{
				id: 1,
				name: "admin",
				password: "admin",
				groups: [
					"users", "sudoers"
				],
				path: ["/bin"],
				home: "/home"
			},
			{
				id:0,
				name: "root",
				password: "toor",
				groups: [
				],
				path: ["/bin"],
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
					directory:true,
					name: "home",
					files: [
						{
							name: "home.key",
							content: "16037ec69a2e3753c99b4a2892de5033"
						}
					]
				},
				{
					directory: true,
					name: "bin",
					files:[
					{
						executable: true,
						name: "cat",
						cmd: cmd_cat
					},
					{
						executable: true,
						name: "exit",
						cmd: cmd_exit
					},
					{
						executable:true,
						name: "service",
						cmd: cmd_service,
					},
					{
						directory: true,
						name: "services",
						files: [
						{
							name: "ftp",
							version: 1,
							cmd: svc_ftp
						},
						{
							name: "ssh",
							version: 2.2,
							cmd: svc_ssh
						}
						]
					}]
				},
				{
					directory: true,
					name: "hacks",
					files:[]
				}
			]
		},
		running: {},
		ports: {},
		init:["ssh", "ftp"],
	};
internet[1] = pc1;
var ssh_stack = []; // stack of the previous ips we were connected to via ssh




function getHost(current_pc, ip) {
	if (ip == "127.0.0.1") {
		return current_pc;
	}
	if (typeof internet[ip]== 'undefined') {
		return null;
	}
	return internet[ip];
}

var portMeanings = {
	21:  "21/tcp   open  ftp",
	22:  "22/tcp   open  ssh",
	25:  "25/tcp   open  smtp",
	80:  "80/tcp   open  http",
	110: "110/tcp  open  pop3",
	143: "143/tcp  open  imap",
	389: "389/tcp  open  ldap",
	443: "443/tcp  open  https",
	465: "465/tcp  open  smtps",
	636: "636/tcp  open  ldapssl",
	993: "993/tcp  open  imaps",
	995: "995/tcp  open  smtps"
}