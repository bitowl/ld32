
var admin_usernames = ["admin", "administrator", "yoda", "master"];

var usernames = ["peter", "www-data", "marc", "jens", "stefan", "student", "teacher", "hannah", "cat", "dog", "meauw", "mantara", "eclipse", "work", "jk", "mn", "ar", "jannis", "pete", "games", "hidden", "mom", "dad"];

var hostnames = ["web", "floorbox", "glados", "athen", "rom", "spartha", "alexandria", "pc", "netbook-2432", "netbook-6372", "netbook-6734", "hackcenter", "kitchen-server", "production", "deployment", "development", "testing", "home", "www", "database", "cookiecracker"];

var account_details = ["bank.txt", "account.txt", "bankaccount", "accdetails.txt", "nothing"];

var busybox = [
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
	name: "mv",
	cmd: function(p,f) {cmd_mv(p,f);}
},
{
	executable: true,
	name: "mkdir",
	cmd: function(p,f) {cmd_mkdir(p,f);}
},
{
	executable: true,
	name: "ps",
	cmd: function(p,f) {cmd_ps(p,f);}
},
{
	executable:true,
	name: "date",
	cmd: function() {cmd_date();}
},
{
	executable: true,
	name: "service",
	cmd: function(p,f,o,c) {cmd_service(p,f,o,c);}
},
{
	executable:true,
	name: "exit",
	cmd: function() {cmd_exit();}
},


// 4th wall breaking things
{
	executable: true,
	name: "save",
	cmd: function(p,f) {cmd_save(p,f);}
},
{
	executable: true,
	name: "reset",
	cmd: function(p,f) {cmd_reset(p,f);}
}

];


var internet_tools = [
{
	executable: true,
	name: "nmap",
	cmd: function(p,f,c) {cmd_nmap(p,f,c);}
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
	executable:true,
	name: "hostname",
	cmd: function(p,f) {cmd_hostname(p,f);}
},
{
	executable:true,
	name: "ping",
	cmd: function(p,f,c) {cmd_ping(p,f,c);}
},
{
	executable:true,
	name: "mail",
	cmd: function(p,f) {cmd_mail(p,f);}
}
];

var money_tools = [
{
	executable:true,
	name: "bank",
	cmd: function(p,f) {cmd_bank(p,f);}
},
{
	executable: true,
	name: "eshop",
	cmd: function(p,f) {cmd_eshop(p,f);}
}];

var services = {
	"bealake": {
		name: "bealake",
		cmd: svc_bealake,
		maxVersion: 20,
	},
	"mail": {
		name: "mail",
		cmd: svc_mail,
		maxVersion: 10,
	},
	"ssh": {
		name: "ssh",
		cmd: svc_ssh,
		maxVersion: 7,
	},
	"ftp": {
		name: "ftp",
		cmd: svc_ftp,
		maxVersion: 5	
	}
}

// creates a new random pc for the internet based on the seed and an ip
function setUpRandomPC(seed, ip) {
	var computer = {
		hostname: randomArr(seed, hostnames),
		ping: randomInt(seed, 1000),
		ip: ip,
		pc: 0,					// programm counter
		users: [],				// users
		pwd: {},				// current directory
		root: {
			directory: true,
			name: "/",
			path: "/",
			parent: null,
			files:[]
		},
		running: [],			// running processes
		ports: {},				// open ports
		init: [],				// programms started on start
	};
	var bin = {
		directory: true,
		name: "bin",
		files:[]
	};
	computer.root.files.push(bin);
	var svc = {
		directory:true,
		name: "services",
		files:[] 
	};
	bin.files.push(svc);
	var home = {
		directory:true,
		name: "home",
		files:[]
	}
	computer.root.files.push(home);

	mergeFiles(bin, busybox);
	if (randomBool(seed)) {
		mergeFiles(bin, internet_tools);
	}
	if (randomBool(seed)) {
		mergeFiles(bin, money_tools);
	}

	// users
	var userCount = 5-Math.floor(Math.log2(randomInt(seed, 31)+1));

	console.log(userCount);
	computer.users.push({
		name: "root",
		password: generateRandomPassword(seed),
		groups: [
		],
		path: ["/bin", "/sbin"],
		home: "/"
	});
	for (var i = 1; i < userCount; i++) {
		var admin = false;
		if (i == 1) {
			// 50% chance for a second admin account
			admin = randomBool(seed);
		}
		// TODO check for double usernames
		var name  = admin?randomArr(seed, admin_usernames):randomArr(seed, usernames);
		computer.users.push({
			name: name,
			password: generateRandomPassword(seed),
			groups: [
			],
			path: ["/bin", "/sbin"],
			home: "/home/"+name
		});
		var hm = {
			directory: true,
			name: name,
			files: []
		}
		home.files.push(hm);
		if (random(seed)<0.2) { // 20% have an own bank account
			var acc = getRandBankAccount(seed, random(seed)*999);
			hm.files.push({
				name: randomArr(seed,account_details),
				content: "number: " + acc.number+"\npin: "+acc.ping,
			});
		}
	};


	for (service in services) {
		if (random(seed) < 0.5) { // 50% chance for every service
			console.log("set up service "+service);
			var sr = clone(services[service]);
			sr.version = randomInt(seed, services[service].maxVersion);
			delete sr.maxVersion;
			sr.parent = svc;
			svc.files.push(sr);

			if (random(seed) < 0.9) { // 90% chance for services to be autostart
				computer.init.push(service);
			}
		}
	}




	internet[ip] = computer;
	boot(computer);
	return computer;
}

function getRandomIP(seed) {
	var ip = Math.floor(random(seed) * 255) + "." + Math.floor(random(seed) * 255) + "." + Math.floor(random(seed) * 255) + "." + Math.floor(random(seed) * 255);
	while (internet[ip] != null) { // don't report an already existing ip
		ip = Math.floor(random(seed) * 255) + "." + Math.floor(random(seed) * 255) + "." + Math.floor(random(seed) * 255) + "." + Math.floor(random(seed) * 255);
	}
	return ip;
}

SMALL = "abcdefghijklnopqrstuvwxyz";
BIG = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
NUMBER = "0123456789";
SPECIAL = " !§$%&/()=?#-.,_+";
function generateRandomPassword(seed, min, max) {
	if (min == null) {min = 0;}
	if (max == null) {max = 100;}
	var length = randomInt(seed, 20);
	var passwd = "";
	for (var i = 0; i < length; i++) {
		var rand = random(seed);
		if (rand < 0.6) {  // 60% small letters
			passwd += randomStr(seed, SMALL);
		} else if (rand < 0.8) { // 20% BIG LETTers
			passwd += randomStr(seed, BIG);
		} else if (rand < 0.95) { // 15% numbers
			passwd += randomStr(seed, NUMBER);
		} else { // 5% special characters
			passwd += randomStr(seed, SPECIAL);
		}
	};
	if (getPasswordStrength(passwd)>max || getPasswordStrength(passwd) < min) {
		return generateRandomPassword(seed, min, max);
	}
	return passwd;
}

function getPasswordStrength(passwd) {
	var strength = 0;
	for (var i = 0; i < passwd.length; i++) {
		if (SMALL.indexOf(passwd[i])>-1) {
			strength += 0.8;
		} else if (BIG.indexOf(passwd[i])>-1) {
			strength += 1;
		} else if (NUMBER.indexOf(passwd[i])>-1) {
			strength +=1.5;
		} else {
			strength +=2;
		}
	}
	return Math.floor(strength);
}

function mergeFiles(folder, files) {
	for (var i = 0; i < files.length; i++) {
		folder.files.push(files[i]);
	}
}

function generateHostname(seed) {
	return "TODO";
}

function generatePC(seed, config) {
	var ip = getRandomIP(seed);

	var computer = {
		hostname: config.hostname?config.hostname:generateHostname(seed),
		ip: ip,
		ping: config.ping?config.ping:randomInt(seed, config.maxPing?config.maxPing:1000),
		pc: 0,					// programm counter
		users: [],				// users
		pwd: {},				// current directory
		root: {
			directory: true,
			name: "/",
			path: "/",
			parent: null,
			files:[]
		},
		running: [],			// running processes
		ports: {},				// open ports
		init: config.init?config.init:[],				// programms started on start
	};
	var bin = {
		directory: true,
		name: "bin",
		files:[]
	};
	computer.root.files.push(bin);
	mergeFiles(bin, busybox);
	mergeFiles(bin, internet_tools);
	if (config.money) {
		mergeFiles(bin, money_tools);
	}

	var svc = {
		directory:true,
		name: "services",
		files:[] 
	};
	bin.files.push(svc);



	// users
	computer.users.push({
		name: "root",
		password: generateRandomPassword(seed),
		groups: [
		],
		path: ["/bin", "/sbin"],
		home: "/"
	});

	if (config.users) {
		for (var i = 0; i < config.users.length; i++) {
			computer.users.push(config.users[i]);
		};
		
	} else {
		// GENERATE RANDOM
	}
	

	// generate folders
	for (var i = 0; i < config.folders.length; i++) {
		genFolder(computer.root, config.folders[i]);
	}

	setUpDirectories(computer.root);

	for (var i = 0; i < config.files.length; i++) {
		console.log("SET UP FILE"+config.files[i]);
		var dir = getFileByAbsolutePath(config.files[i].path.substring(0, config.files[i].path.lastIndexOf("/")), computer.root);
		if (dir == null) {
			console.log("file "+config.files[i].path+" COULD NOT BE PLACED :/");
			continue;
		}
		console.log("ASDFASDF");
		console.log(dir);
		var file = newFile(dir, config.files[i].path.substring(config.files[i].path.lastIndexOf("/")+1));
		file.content = config.files[i].content;
		file.executable = config.files[i].executable;
		file.cmd = config.files[i].cmd;

	}

	for (service in config.services) {
		console.log("set up service "+service);
		var sr = clone(services[service]);
		sr.version = config.services[service];
		sr.parent = svc;
		svc.files.push(sr);
	}



	internet[ip] = computer;
	boot(computer);
	return computer;
}

function genFolder(oRoot, path) {
	console.log("gen Folder " +path);
	var parts = path.split("/");

	var root = oRoot;
	for (var i = 1; i < parts.length; i++) {
		var found = false;
		for (var j = 0; j < root.files.length; j++) {
			console.log("not:"+root.files[j].name +"<>"+ parts[i]);
			if (root.files[j].name == parts[i]) {
				found = true;
				root = root.files[j];
				break;
			}
		}
		if (!found) {
			console.log("new folder:"+parts[i]);
			// no file found
			var dir = {
				directory: true,
				name: parts[i],
				files:[]
			};
			root.files.push(dir);
			root = dir;
		}
	};
}


function generateOwnPC(seed, user, passwd) {
	var ip = getRandomIP(seed);

	if (internet[ip] != null) {return;} // TODO create new one?

	var computer = {
		hostname: "mylittlepc",
		ip: ip,
		ping: 100,
		pc: 0,					// programm counter
		users: [],				// users
		pwd: {},				// current directory
		root: {
			directory: true,
			name: "/",
			path: "/",
			parent: null,
			files:[]
		},
		running: [],			// running processes
		ports: {},				// open ports
		init: ["mail"],				// programms started on start
	};
	var bin = {
		directory: true,
		name: "bin",
		files:[]
	};
	computer.root.files.push(bin);
	mergeFiles(bin, busybox);
	mergeFiles(bin, internet_tools);
	mergeFiles(bin, money_tools);

var srvc = {
	directory:true,
	name: "services",
	files:[] 
};
	bin.files.push(srvc);

	srvc.files.push(
	{
		name: "mail",
		cmd: svc_mail,
		version: 0.2
	});


	// users
	computer.users.push({
		name: "root",
		password: "",
		groups: [
		],
		path: ["/bin", "/sbin"],
		home: "/"
	});
	computer.users.push({
		name: user,
		password: passwd,
		groups: [
		],
		path: ["/bin", "/sbin"],
		home: "/home/"+user
	});

	var home = {
		directory: true,
		name: "home",
		files: []
	};
	computer.root.files.push(home);

	var acc = getRandBankAccount(seed, 10); // 10 cross start dollarz

	var own = {
		directory: true,
		name: user,
		files:[{
		directory:true,
		name: "mails",
		files:[]
		},
		{
			directory:true,
			name: "private",
			files:[
				{
					name:"bankaccount.txt",
					content: "id: "+acc.number+"\npin: "+acc.pin
				}
			]
		}
		]
	};
	home.files.push(own);

	own.files.push()



	internet[ip] = computer;
	boot(computer);
	return computer;
}


// var seed = getRandom(Math.random());
// setUpRandomPC(seed);
// console.log(internet);
// console.log(JSONE.stringify(internet).length);
