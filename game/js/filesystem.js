
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