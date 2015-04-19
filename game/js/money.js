var accounts = {
	1123123: {
		pin: 1234,
		balance: 512.21
	},
	1234: {
		pin: 12312312312,
		balance: 0
	}
};

function cmd_bank(params) {
	if (params.length == 1) {
		console_println("bank accounting tool");
		console_println("bank balance ACCOUNT");
		console_println("bank transfer SRC DEST AMOUNT");
		console_println("bank changepin ACCOUNT");
		console_finishedCommand(0);
		return;
	}
	if (params[1] == "transfer") {
		if (params.length != 5) {
			console_printErrln("bank: transfer SRC DEST AMOUNT");
			console_finishedCommand(1);
			return;
		}
		console_print("PIN: ");
		console_enterPassword(function(pin) {
			if (accounts[params[2]]!= null && pin == accounts[params[2]].pin) {
				if (accounts[params[3]]==null) {
					console_printErrln("bank: destination account does not accept money");
					console_finishedCommand(1);
					return;
				}
				if (accounts[params[2]].balance < params[4] || params[4]<0 || isNaN(params[4])) {
					console_printErrln("bank: not enough money");
					console_finishedCommand(1);
					return;	
				}
				accounts[params[2]].balance -= parseInt(params[4]);
				accounts[params[3]].balance += parseInt(params[4]);
				console_println("money successfully transfered");
				console_finishedCommand(0);
			} else {
				console_printErrln("bank: access denied");
				console_finishedCommand(1);
			}
		});

	} else if (params[1] == "balance") {
		if (params.length != 3) {
			console_printErrln("bank: you have to pass the account number");
			console_finishedCommand(1);
			return;
		}
		console_print("PIN: ");
		console_enterPassword(function(pin) {
			if (accounts[params[2]]!= null && pin == accounts[params[2]].pin) {
				console_println("balance: " + accounts[params[2]].balance);
				console_finishedCommand(0);
			} else {
				console_printErrln("bank: access denied");
				console_finishedCommand(1);
			}
		});
	} else if (params[1] == "changepin") {
		if (params.length != 3) {
			console_printErrln("bank: you have to pass the account number");
			console_finishedCommand(1);
			return;
		}
		console_print("old PIN: ");
		console_enterPassword(function(pin) {
			if (accounts[params[2]]!= null && pin == accounts[params[2]].pin) {
				console_print("new PIN: ");
				console_enterPassword(function(newpin) {
					console_print("new PIN(repeat): ");
					console_enterPassword(function(newpin2) {
						if (newpin != newpin2) {
							console_printErrln("bank: sorry, pins do not match");
							console_finishedCommand(1);
							return;
						}
						accounts[params[2]].pin = newpin;
						console_println("pin successfully changed");
						console_finishedCommand();
					});
				});
			} else {
				console_printErrln("bank: access denied");
				console_finishedCommand(1);
			}
		});
	}else {
		console_printErrln("bank: " + params[1]+": parameter unknown");
		console_finishedCommand(1);
	}
}

var shop = {
	ssh_client: {
		desc: "ssh client",
		price: 5,
		files: [
			{
				executable: true,
				name: "ssh",
				cmd: function(p,f) {cmd_ssh(p,f);}
			}
		]
	},
	ssh_service: {
		desc: "ssh server service",
		price: 100,
		files:[
			{
				name: "ssh",
				cmd: svc_ssh,
			},
			{
				name: "ssh_readme",
				content: "place ssh file in /bin/services"
			}
		]
	}, 
	better_internet: {
		desc: "better internet connection",
		price: 1000,
		cmd: function() {
			current_computer.ping -= 100;
		}
	},
	ftp_root:{
		desc: "ftp root <3",
		price: 300,
		files: [
			{
				name: "ftpH4xx0r",
				executable: true,
				cmd: function(p) {readRootPw(p, "ftp", 0, 3, 2000);}
			}
		]

	},
	web_root: {
		desc: "root via bealake version <2 (very old)",
		price: 200,
		files: [
		{
			name: "bealakeRoot",
			executable: true,
			cmd: function(p) {readRootPw(p, "bealake", 0, 2, 0);}
		}]
	}

}

var cart = {};

function cmd_eshop(params) {
	if (params.length == 1) {
		console_println("eshop best shop euw");
		console_println("eshop list");
		console_println("eshop add PRODUCT");
		console_println("eshop remove PRODUCT");
		console_println("eshop cart");
		console_println("eshop checkout ACCOUNT");
		console_finishedCommand(0);
		return;
	}
	switch (params[1]) {
		case "list":
			// list products
			for (product in shop) {
				console_println(product + "("+shop[product].price+"): " + shop[product].desc);
			}
			console_finishedCommand();
			break;
		case "add":
			if (params.length != 3) {
				console_printErrln("eshop add PRODUCT");
				console_finishedCommand(1);
				return;
			}
			if (shop[params[2]] == null) {
				console_printErrln("eshop: " + params[2]+": product unknown");
				console_finishedCommand(1);
				return;
			}
			cart [params[2]] = true;
			console_println(params[2]+" added to cart");
			console_finishedCommand();
			break;
		case "remove":
			if (params.length != 3) {
				console_printErrln("eshop remove PRODUCT");
				console_finishedCommand(1);
				return;
			}
			if (cart[params[2]] == null) {
				console_printErrln("eshop: " + params[2]+": product not in cart");
				console_finishedCommand(1);
				return;
			}
			delete cart[params[2]];
			console_println(params[2]+" removed from cart");
			console_finishedCommand();
			break;
		case "cart":
			console_println("contents of your cart:");
			var total = 0;
			for (product in cart) {
				console_println(product + "("+shop[product].price+"): " + shop[product].desc);
				total += shop[product].price;
			}
			console_println("-----------");
			console_println("total: "+total);
			console_finishedCommand();
			break;
		case "checkout": 
			if (params.length != 3) {
				console_printErrln("eshop checkout ACCOUNT");
				console_finishedCommand(1);
				return;
			}
			var total = 0;
			for (product in cart) {
				console_println(product + "("+shop[product].price+"): " + shop[product].desc);
				total += shop[product].price;
			}

			console_print("PIN: ");
			console_enterPassword(function(pin) {
				if (accounts[params[2]]!= null && pin == accounts[params[2]].pin) {
					if (accounts[params[2]].balance < total) {
						console_printErrln("bank: not enough money");
						console_finishedCommand(1);
						return;	
					}
					accounts[params[2]].balance -= total;
					console_println("shopping successfull");
					console_println("the requested files are being download to the eshop folder in your home folder");

					// download files
					var folder = getFileByAbsolutePath(createPath(current_computer.current_user.home, "eshop"), current_computer.root);
					if (folder == null) {
						folder = newDirectory(getFileByAbsolutePath(current_computer.current_user.home, current_computer.root), "eshop", current_computer.current_user.id);
					}

					for (product in cart) {
						for (var i = 0; i < shop[product].files.length; i++) {
							var prog = shop[product].files[i];
							prog.prent = folder;
							prog.path = createPath(folder.path, prog.name);
							folder.files.push(prog);
						};
						
					}
					

					console_finishedCommand(0);
				} else {
					console_printErrln("bank: access denied");
					console_finishedCommand(1);
				}
			});

			break;
		default:
			console_printErrln("eshop: " + params[1]+": parameter unknown");
			console_finishedCommand(1);
			break;
	}
}