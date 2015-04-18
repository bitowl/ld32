
// creates a new directory in a parent directory
function newDirectory(parent, name) {
	var dir = {
		directory: true,
		name: name,
		path: parent.path + name + "/",
		parent: parent,
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
		path: parent.path + name + "/",
		parent: parent,
	}
	parent.files.push(file);
	return file;
}

// searches for a file in a directory
function getFile(parent, name) {

	if (name == ".") {
		return current_computer.pwd;
	} else if (name == "..") {
		var dir = current_computer.pwd.parent;
		if (dir == null) { // we are at root level
			dir = current_computer.pwd;
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