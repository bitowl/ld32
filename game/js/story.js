// all the computers needed to drive the story
function createWorld() {
	var seed = getRandom(Math.random());

	var pw = generateRandomPassword(seed);
	while (getPasswordStrength (pw) < 20) {
		pw = generateRandomPassword(seed);
	}


	var acc = getRandBankAccount(seed, random(seed)*99999999);
	// MorpheusCat
	var config = {
		hostname: "overlord",
		ping: 0,
		users: [{
			name: "morpheuscat",
			password: pw,
			groups: ["sudoers"],
			path: ["/bin"],
			home: "/home/morpheuscat/"
		}],
		folders: [
			"/home/morpheuscat",
		],
		files:[
			{
				path:"/home/morpheuscat/moneyz.txt",
				content: "number: " + acc.number+ "\npin: "+acc.pin,
			},
			{
				path:"/home/morpheuscat/gameover",
				executable: true,
				cmd: function() {
					cmd_gameover();
				}
			}
		],
		init: ["ssh","mail"],
		services: {
			ssh: 3,
			mail: 4,
			ftp: 1
		}
	};
	var mcpc = generatePC(seed, config);
	tutorial.morpheuscatIP = mcpc.ip;

	// build pc

	// Global Corp
	var config = {
		hostname: "globalCorp_master",
		ping: 0,
		users: [{
			name: "master",
			password: generateRandomPassword(seed,7,20),
			groups: ["sudoers"],
			path: ["/bin"],
			home: "/home/master/"
		}],
		folders: [
			"/home/master",
		],
		files:[
			{
				path:"/home/master/controller.txt",
				content: "morpheuscat@"+mcpc.ip,
			}
		],
		init: ["ssh"],
		services: {
			ssh: 7,
		}
	};
	var gcpc = generatePC(seed, config);


	var config = {
		hostname: "spaceunicorn",
		ping: 0,
		users: [{
			name: "admin",
			password: generateRandomPassword(seed,1,10),
			groups: ["sudoers"],
			path: ["/bin"],
			home: "/home/admin"
		}],
		folders: [
			"/home/admin",
			"/secret",
			"/secret/hacks",
			"/var",
			"/var/log"
		],
		files:[
			{
				path:"/secret/hacks/megaPwCracker",
				executable: true,
				cmd: function(p) {	pwCracker(p, "ssh", 0,7, 0, 50);}
			},

			{
				path:"/var/log/bacula.log",
				content: "backup from "+ gcpc.ip+" complete."
			}
		],
		init: ["ssh", "bealake"],
		services: {
			ssh: 7,
			bealake: 17,
		}
	};
	var sipc = generatePC(seed, config);



	var config = {
		hostname: "nosetablet1",
		ping: 12,
		users: [{
			name: "admin",
			password: generateRandomPassword(seed,1,10),
			groups: ["sudoers"],
			path: ["/bin"],
			home: "/home/admin"
		}],
		folders: [
			"/home/admin",
			"/home/admin/manuals"
		],
		files:[
			{
				path: "/home/admin/manuals/nmap.txt",
				content: "use nmap to scan for open ports.\nuse nmap -f to make a full scan which takes longer but maybe finds out which version of the software is running"
			},
			{
				path: "/home/admin/manuals/scp.txt",
				content: "using scp you can transfer files from one computer to another\nscp SRC USER@HOST:DEST is the correct syntax"
			}
		],
		init: ["ssh", "bealake", "mail"],
		services: {
			ssh: 7,
			bealake: 6,
			mail: 4,
		}
	};
	var n1pc = generatePC(seed, config);
	tutorial.nosetablet1 = n1pc.ip;

	var config = {
		hostname: "nosetablet_web",
		ping: 42,
		users: [{
			name: "admin",
			password: generateRandomPassword(seed,1,5),
			groups: ["sudoers"],
			path: ["/bin"],
			home: "/home/admin"
		}],
		folders: [
			"/home/admin",

		],
		files:[
			{
				path:"/home/admin/contract.txt",
				content: "give moneyz to the space unicorns at "+ sipc.ip
			},
			{
				path:"/bin/pwstrength",
				executable:true,
				name: "pwstrength",
				cmd: function(p) {
					cmd_pwstrength(p);
				}
			}
		],
		init: ["bealake"],
		services: {
			ssh: 7,
			bealake: 3,
		}
	};
	var n2pc = generatePC(seed, config);
	tutorial.nosetablet2 = n2pc.ip;

	var config = {
		hostname: "nosetablet_shell",
		ping: 80,
		users: [{
			name: "admin",
			password: generateRandomPassword(seed,1,10),
			groups: ["sudoers"],
			path: ["/bin"],
			home: "/home/admin"
		}],
		folders: [
			"/home/admin",
		],
		files:[
			{
				path:"/secret/hacks/megaPwCracker",
				executable: true,
				cmd: function(p) {	pwCracker(p, "ssh", 0,7, 0, 50);}
			}
		],
		init: ["ssh"],
		services: {
			ssh: 2,
		}
	};
	var n3pc = generatePC(seed, config);
	tutorial.nosetablet3 = n3pc.ip;
}