
// creates a new directory in a parent directory
function newDirectory(parent, name) {
	var dir = {
		directory: true,
		name: name,
		path: createPath(parent.path, name),
		parent: parent,
		owner: current_computer.current_user.name,
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
function getFile(parent, name) { // TODO split at / (other function?)
	if (name.indexOf("/") === 0) {
		return getFileByAbsolutePath(name);
	} else if (name == "." || name == "") {
		return parent;
	} else if (name == "..") {
		var dir = parent.parent;
		if (dir == null) { // we are at root level
			dir = parent;
		}
		return dir;
	} else {
		for (var i = 0; i < parent.files.length; i++) {
			if (parent.files[i].name == name) {
				return parent.files[i];
			}
		}
		return null;
	}
}

function getFileByAbsolutePath(name) {
	var parts = name.split("/");
	var dir =  current_computer.root;
	for (var i = 1; i < parts.length; i++) {
		dir = getFile(dir, parts[i]);	
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