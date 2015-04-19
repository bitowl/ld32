var internet = { // THE INTERNET :O
};

var ssh_stack = []; // stack of the previous ips we were connected to via ssh

function getHost(current_pc, ip) {
	if (ip == "127.0.0.1") {
		return current_pc;
	}

	if (typeof internet[ip]== 'undefined') {
		if (/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(ip)) {
			// the ip is valid
			// is there a new computer?
			var seed = getRandom(parseInt(ip.replace(/\./g,'')) + tutorial.inetOffset);
			if (random(seed) < 0.8) {
				// a random pc
				return setUpRandomPC(seed, ip);
			} else {
				console.log("this part of the internet is empty");
			}
		}
		return null;
	}
	return internet[ip];
}

function getPing(pc1, pc2) {
	if (pc1 == pc2) {
		return Math.floor(Math.random() * 20);
	}

	var ping1 = Math.floor(pc1.ping + pc1.ping * ((Math.random() - 0.3) / 10));
	var ping2= Math.floor(pc2.ping + pc2.ping *((Math.random() - 0.5) / 10));
	console.log("ping1: "+ping1+" / ping2: " +ping2);
	return ping1 + ping2;
}

var portMeanings = {
//		  PORT     STATE SERVICE
	21:  "21/tcp   open  ftp    ",
	22:  "22/tcp   open  ssh    ",
	25:  "25/tcp   open  smtp   ",
	80:  "80/tcp   open  http   ",
	110: "110/tcp  open  pop3   ",
	143: "143/tcp  open  imap   ",
	389: "389/tcp  open  ldap   ",
	443: "443/tcp  open  https  ",
	465: "465/tcp  open  smtps  ",
	636: "636/tcp  open  ldapssl",
	993: "993/tcp  open  imaps  ",
	995: "995/tcp  open  smtps  "
}