
// creates a new directory in a parent directory
function newDirectory(parent, name, owner) {
	if (typeof owner == 'undefined') {
		owner = current_computer.current_user.name;
	}
	var dir = {
		directory: true,
		name: name,
		path: createPath(parent.path, name),
		parent: parent,
		owner: owner,
		rights: parseInt(111101101,2),
		files: []
	}
	parent.files.push(dir);
	return dir;
}

// creates a new file in a parent directory
function newFile(parent, name) {
	var file = {
		directory: false,
		name: name,
		path: createPath(parent.path, name),
		parent: parent,
		owner: current_computer.current_user.name,
		rights: parseInt(111100100,2),
	}
	parent.files.push(file);
	return file;
}

// searches for a file in a directory
function getFile(parent, name, root) { // TODO split at / (other function?)
	if (name.indexOf("/") === 0) {
		return getFileByAbsolutePath(name, root);
	} else if (name == "." || name == "") {
		return parent;
	} else if (name == "..") {
		//console.log(parent);
		//console.log(parent.parent);
		var dir = parent.parent;
		if (dir == null) { // we are at root level
			dir = parent;
		}
		//console.log("return " + dir.path);
		return dir;
	} else {
		//console.log("FIND FILE: ");
		//console.log(parent);
		if (name.indexOf("/") < 0) {
			// the file should be in this folder
			//console.log("length:"+parent.files.length);
			for (var i = 0; i < parent.files.length; i++) {
				//console.log(parent.files[i].name);
				if (parent.files[i].name == name) {
					return parent.files[i];
				}
			}
		} else {
			// find the first part of the path
			var prnt = getFile(parent, name.substring(0, name.indexOf("/")));
			return getFile(prnt, name.substring(name.indexOf("/")+1));
		}
		return null;
	}
}

function getFileByAbsolutePath(name, root) {
	//console.log(root);
	// console.log("getAbsolulte("+name+","+root.path);
	var parts = name.split("/");
	var dir = root;
	if (typeof root == 'undefined') {
		//console.log("no root supplied");
		dir = current_computer.root;
	}
	for (var i = 1; i < parts.length; i++) {
		//console.log("search for "+parts[i]+" in "+dir.files);
		dir = getFile(dir, parts[i],root);
		if (dir == null) {
			return null;
		}
	}
	return dir;
}

function createPath(dir, name) {
	if (dir.endsWith("/")) {
		return dir + name;
	} else {
		return dir + "/" + name;
	}
}

// goes through the full directory tree and sets parent and path objects
function setUpDirectories(dir) {
	//console.log(dir);
	for (var i = 0; i < dir.files.length; i++) {
		dir.files[i].path = createPath(dir.path, dir.files[i].name);
		dir.files[i].parent = dir;
		if (dir.files[i].directory) {
			setUpDirectories(dir.files[i]);
		}
	};
}