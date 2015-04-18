
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
	var userCount = Math.floor(Math.log2(randomInt(seed, 32)));
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


var seed = getRandom(2);
setUpRandomPC(seed);

console.log(internet);
console.log(JSONE.stringify(internet).length);