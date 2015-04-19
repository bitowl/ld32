
var admin_usernames = ["admin", "administrator", "yoda", "master"];

var usernames = [""];


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
	cmd: function(p,f) {cmd_service(p,f);}
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
	cmd: function(p,f) {cmd_nmap(p,f);}
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
	cmd: function(p,f) {cmd_ping(p,f);}
},
{
	executable:true,
	name: "mail",
	cmd: function(p,f) {cmd_mail(p,f);}
}
];

// creates a new random pc for the internet based on the seed
function setUpRandomPC(seed) {
	var ip = getRandomIP(seed);

	if (internet[ip] != null) {return;} // TODO create new one?

	var computer = {
		hostname: "mylittlepc",
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
	mergeFiles(bin, busybox);
	if (randomBool(seed)) {
		mergeFiles(bin, internet_tools);
	}

	// users
	var userCount = 5-Math.floor(Math.log2(randomInt(seed, 31)+1));

	console.log(userCount);
	computer.users.push({
		name: "root",
		password: "notreallyhard",
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
		computer.users.push({
		name: randomArr(seed, admin_usernames),
		password: "notreallyhard",
		groups: [
		],
		path: ["/bin", "/sbin"],
		home: "/"
	});
	};



	internet[ip] = computer;
	boot(computer);
}

function getRandomIP(seed) {
	return Math.floor(random(seed) * 256) + "." + Math.floor(random(seed) * 256) + "." + Math.floor(random(seed) * 256) + "." + Math.floor(random(seed) * 256);
}
function mergeFiles(folder, files) {
	for (var i = 0; i < files.length; i++) {
		folder.files.push(files[i]);
	}
}



function generateOwnPC(seed, user, passwd) {
	var ip = getRandomIP(seed);

	if (internet[ip] != null) {return;} // TODO create new one?

	var computer = {
		hostname: "mylittlepc",
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
		password: "notreallyhard",
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

	var own = {
		directory: true,
		name: user,
		files:[]
	};
	home.files.push(own);

	own.files.push({
		directory:true,
		name: "mails",
		files:[]
	})



	internet[ip] = computer;
	boot(computer);
	return computer;
}


// var seed = getRandom(Math.random());
// setUpRandomPC(seed);
// console.log(internet);
// console.log(JSONE.stringify(internet).length);
