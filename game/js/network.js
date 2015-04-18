var internet = { // THE INTERNET :O
}


var pc1 = {
		hostname: "mylittlepc",
		ip: "1",
		users: [
			{
				id: 1,
				name: "admin",
				password: "admin",
				groups: [
					"users", "sudoers"
				],
				home: "/home"
			},
			{
				id:0,
				name: "root",
				password: "toor",
				groups: [
				],
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
					}]
				},
				{
					directory: true,
					name: "hacks",
					files:[]
				}
			]
		},
		running: [
			{
				id: 1,
				name: "init",
				uid: 0
			},
			{
				id:2,
				name:"sshd",
				uid:0
			}
		],
		ports: {
			21:2
		}
	};
internet[1] = pc1;
console.log(pc1.root);
setUpDirectories(pc1.root);

var ssh_stack = []; // stack of the previous ips we were connected to via ssh

function getRandomIP(seed) {
	return Math.floor(random(seed) * 256) + "." + Math.floor(random(seed) * 256) + "." + Math.floor(random(seed) * 256) + "." + Math.floor(random(seed) * 256);
}


function getHost(ip) {
	if (typeof internet[ip]== 'undefined') {
		console_printErrln("ping: unknown host " + ip);
		return null;
	}
	return internet[ip];
}

var portMeanings = {
	21: "21/tcp open  ssh"
}