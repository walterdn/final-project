var helper = {

	removeSpaces :	function(str) {
			return str.replace(/\s/g, '').toLowerCase();
	},

	changeName : function(str) {
		//find a # in the name and replace it with shrp
		str = str.replace("#", "shrp").toLowerCase();
		return str;
	},

	isArrayContained : function (inner, outer) { //helper func for filter functions. checks if an array is entirely contained in another
		for(i=0; i<inner.length; i++) {
			if (outer.indexOf(inner[i]) == -1) return false;
		}
		return true;
	}

};



module.exports = exports = helper;