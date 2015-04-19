// triggers for tutorial mails

TRIGGER_WELCOME_MAIL = 0
TRIGGER_LIST_FILES = 1

calledTriggers = {}


function sendTrigger(trigger, params) {
	if (calledTriggers[trigger]) {
		return;
	}
	calledTriggers[trigger] = true;

	switch(trigger) {
		case TRIGGER_WELCOME_MAIL:
		sendMail(params[0], params[1], "We need your help", "Hey " + params[0]+",\n\
\n\
We need your help!\n\
Corrupt governments are fighting a cyber war and trying to take over the whole internet.\n\
We need to do everything we can to oppose them.\n\
\n\
If you're not familiar with the command line, that's fine. Just learn as you go.\n\
Use ls to list the contents of your current directory. And use cd and then a name to switch to another directory.\n\
You can use cat to read files.\n\
\n\
greetings\n\
MorphRabbit\n", function(err) {console.log("----" + err)});
		break;
	}
}