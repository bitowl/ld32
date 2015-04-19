// triggers for tutorial mails

TRIGGER_WELCOME_MAIL = 0
TRIGGER_LIST_FILES = 1
TRIGGER_CAT_FILE = 2
TRIGGER_SSH_EXITED = 3
TRIGGER_VIRUS_BOUGHT = 4

TRIGGER_SAVE_GAME = 100

var tutorial = {
	calledTriggers:{},	
	host: null,
	user: null,
	morpheuscatIP: null,
	inetOffset: 0.234 // TODO random at beginning
}



function sendTrigger(trigger, params) {
	if (tutorial.calledTriggers[trigger]) {
		return;
	}
	tutorial.calledTriggers[trigger] = true;

	switch(trigger) {
		case TRIGGER_WELCOME_MAIL:
		tutorial.user = params[0];
		tutorial.host = params[1];
		sendMail(params[0], params[1], "We need your help", "morpheuscat@"+tutorial.morpheuscatIP, "Hey " + params[0]+",\n\
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
	files:[
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

sendMail(tutorial.user , tutorial.host, "We're making progress", "morpheuscat@"+tutorial.morpheuscatIP, "Hey,\n\
I see you used the magic of the command line to list the files of a directory.\n\
To print the contents of a file to your screen you can use the command cat.\n\
Just type cat followed by the name of a file.\n\
I placed some confidential information in the secretkey.txt file.\n\
\n\
MorpheusCat",function(){});
		break;
		case TRIGGER_CAT_FILE:

sendMail(tutorial.user, tutorial.host, "Sometimes it's too easy", "morpheuscat@"+tutorial.morpheuscatIP, "Hey,\n\
Did you found the file I was mentioning in my last mail?\n\
It contains the login credentials for a server we recently hacked.\n\
Use ssh to connect to that computer. The command is ssh USER@IP \n\
Once you are connected you can execute commands on that computer.\n\
\n\
Take a look around there and then use exit to come back to your pc. (If there is no exit installed on the remote server you can use Ctrl+D)\n\
\n\
MorpheusCat",function(){});
		break;
		case TRIGGER_SSH_EXITED:
sendMail(tutorial.user , tutorial.host, "Shopping time", "morpheuscat@"+tutorial.morpheuscatIP, "Hey,\n\
Someone told me, there were banking details on that server. Did you find them?\n\
If you found them you can use the bank tool to transfer the money to your account (You hopefully wrote your details down somewhere?).\n\
\n\
With that money you can go to the eshop and buy a password cracker. I will tell you later how to use that.\n\
\n\
MorpheusCat",function(){});
		case TRIGGER_VIRUS_BOUGHT:
sendMail(tutorial.user , tutorial.host, "Your first hack", "morpheuscat@"+tutorial.morpheuscatIP, "Hey,\n\
You downloaded your first password cracking tool. You can use it on a server with ssh running to crack the password of a given user, if it is really simple.\n\
There are also some exploits. Those can hack into certain versions of services and sometimes can give you passwords, create users or start other exploitable services.\n\
We are currently inventigating evil activities of Nosetablet Inc. Here is a list of servers you might want to take a look at:\n\
"+tutorial.nosetablet1+"\n\
"+tutorial.nosetablet2+"\n\
"+tutorial.nosetablet3+"\n\
\n\
MorpheusCat",function(){});
		break;
	}
}