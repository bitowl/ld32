// all the computers needed to drive the story
function createWorld() {
	var seed = getRandom(Math.random());

	// MorpheusCat
	var config = {
		hostname: "overlord",
		ping: 0,
		users: [{
			name: "morpheuscat",
			password: "",
			groups: ["sudoers"],
			path: ["/bin"],
			home: "/home/morpheuscat/"
		}],
		folders: [
			"/home/morpheuscat",
		],
		files:[
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

}