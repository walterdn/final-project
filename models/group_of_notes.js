var GroupOfNotes = function(name, notes) {
	//assert that name is a string, notes is an array of strings

	this.getName = function() {
		return name;
	};

	this.getNotes = function() {
		return notes;
	};

};

module.exports = exports = GroupOfNotes; 