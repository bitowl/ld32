// triggers for tutorial mails

TRIGGER_WELCOME_MAIL = 0
TRIGGER_LIST_FILES = 1
TRIGGER_CAT_FILE = 2
TRIGGER_SAVE_GAME = 100

var tutorial = {
	calledTriggers:{},	
	host: null,
	user: null,

}


var tutip = "123.123.123.123"; // TODO create morpheuscats computer

function sendTrigger(trigger, params) {
	if (tutorial.calledTriggers[trigger]) {
		return;
	}
	tutorial.calledTriggers[trigger] = true;

	switch(trigger) {
		case TRIGGER_WELCOME_MAIL:
		tutorial.user = params[0];
		tutorial.host = params[1];
		sendMail(params[0], params[1], "We need your help", "morpheuscat@"+tutip, "Hey " + params[0]+",\n\
\n\
We need your help!\n\
Corrupt governments are fighting a cyber war and trying to take over the whole internet.\n\
We need everybody we can find to oppose them.\n\
\n\
A scan of your usb-devices shows us that your mouse is not working anymore. Your only weapon in this fight is your keyboard.\n\
If you're not familiar with the command line, that's fine. Just learn as you go.\n\
Use ls to list the contents of your current directory. And use cd and then a name to switch to another directory.\n\
\n\
greetings\n\
MorpheusCat",function(){});
		break;
		case TRIGGER_LIST_FILES:

// build pc
var config = {
	hostname: "whacky",
	users: [{
		name: "admin",
		password: "admin",
		groups: ["sudoers"],
		path: ["/bin"],
		home: "/home/admin/"
	}],
	folders: [
		"/home/admin",
		"/home/admin/cookies",
		"/home/admin/projects",
		"/home/admin/projects/admt",
		"/home/admin/projects/admt/passwords",
		"/home/admin/projects/webmail"
	],
	init: ["ssh"],
	services: {
		"ssh": "0.2"
	}
};
var seed = getRandom(Math.random());
var pc = generatePC(seed, config);

var dir = getFileByAbsolutePath("/home/"+tutorial.user +"/", internet[tutorial.host].root);
dir.files.push({
	name:"secretkey.txt",
	content:"user:     admin\n\
password: admin\n\
ip:       "+pc.ip,
	parent: dir
});

sendMail(tutorial.user , tutorial.host, "We're making progress", "morpheuscat@"+tutip, "Hey,\n\
I see you used the magic of the command line to list the files of a directory.\n\
To print the contents of a file to your screen you can use the command cat.\n\
Just type cat followed by the name of a file.\n\
I placed some confidential information in the secretkey.txt file.\n\
\n\
MorpheusCat",function(){});
		break;
	}
}