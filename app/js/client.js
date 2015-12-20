require('angular/angular');
var angular = window.angular;
var BufferLoader = require('./buffer-loader');


module.exports = function(app) {
	app.controller('MusicController', ['$scope', '$http', function($scope, $http) {
	var startTime;
	var keys = [
		{name: 'A Major', notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']},
		{name: 'B Flat Major', notes: ['A#', 'C', 'D', 'D#', 'F', 'G', 'A']},
		{name: 'B Major', notes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']},
		{name: 'C Major', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B']},
		{name: 'C Sharp Major', notes: ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C']},
		{name: 'D Major', notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#']},
		{name: 'E Flat Major', notes: ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D']},
		{name: 'E Major', notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#']},
		{name: 'F Major', notes: ['F', 'G', 'A', 'A#', 'C', 'D', 'E']},
		{name: 'F Sharp Major', notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F']},
		{name: 'G Major', notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#']},
		{name: 'G Sharp Major', notes: ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G']}
	];

	$scope.chords = [
		{name: 'c maj', notes: ['C', 'E', 'G']},
		{name: 'c min', notes: ["C", "D#", "G"]},
		{name: 'c sharp maj', notes: ["C#", "F", "G#"]},
		{name: 'c sharp min', notes: ["C#", "E", "G#"]},
		{name: 'd maj', notes: ["D", "F#", "A"]},
		{name: 'd min', notes: ["D", "F", "A"]},
		{name: 'e flat maj', notes: ["D#", "G", "A#"]},
		{name: 'e flat min', notes: ["D#", "F#", "A#"]},
		{name: 'e maj', notes: ["E", "G#", "B"]},
		{name: 'e min', notes: ["E", "G", "B"]},
		{name: 'f maj', notes: ["F", "A", "C"]},
		{name: 'f min', notes: ["F", "G#", "C"]},
		{name: 'f sharp maj', notes: ["F#", "A#", "C#"]},
		{name: 'f sharp min', notes: ["F#", "A", "C#"]},
		{name: 'g maj', notes: ["G", "B", "D"]},
		{name: 'g min', notes: ["G", "A#", "D"]},
		{name: 'g sharp maj', notes: ["G#", "C", "D#"]},
		{name: 'g sharp min', notes: ["G#", "B", "D#"]},
		{name: 'a maj', notes: ["A", "C#", "E"]},
		{name: 'a min', notes: ["A", "C", "E"]},
		{name: 'b flat maj', notes: ["A#", "D", "F"]},
		{name: 'b flat min', notes: ["A#", "C#", "F"]},
		{name: 'b maj', notes: ["B", "D#", "F#"]},
		{name: 'b min', notes: ["B", "D", "F#"]}
	];

	$scope.inProgress = false;
	$scope.allowedKeys = [];
	$scope.allowedNotes = [];
	$scope.allowedChords = [];
	$scope.chosenChords = [];

	$scope.melody = [];
	var recording = false;
	$scope.recordingNext = false;

	$scope.context; 
	$scope.bufferLoader;
	context = new AudioContext();

	$(document).keypress(function(e) {
		if (e.which == 97) $scope.playNote($scope.allowedNotes[0]);
		if (e.which == 115) $scope.playNote($scope.allowedNotes[1]);
		if (e.which == 100) $scope.playNote($scope.allowedNotes[2]);
		if (e.which == 102) $scope.playNote($scope.allowedNotes[3]);
		if (e.which == 103) $scope.playNote($scope.allowedNotes[4]);
		if (e.which == 104) $scope.playNote($scope.allowedNotes[5]);
		if (e.which == 106) $scope.playNote($scope.allowedNotes[6]);
		if (e.which == 107) $scope.playNote($scope.allowedNotes[7]);
		if (e.which == 108) $scope.playNote($scope.allowedNotes[8]);
		
		if (e.which == 32) $scope.playSong();
	});

	$scope.saveSong = function() {
		var currUser = $('#currUser').html();
		alert(currUser);
	};

	function removeSpaces (str){
		return str.replace(/\s/g, '').toLowerCase();
	};

	function changeName(str){
		//find a # in the name and replace it with shrp
		str = str.replace("#", "shrp").toLowerCase();
		return str;
	};

	$scope.finishedLoading = function(bufferList) {
    //Create source for audio context
    var sound = context.createBufferSource();
    sound.buffer = bufferList[0];
    sound.connect(context.destination);
  	//Play 
    sound.start(0);
	};


	$scope.playChord = function(chord){
		var name = removeSpaces(chord.name);
		bufferLoader = new BufferLoader(
        context,
        [
        "chords/" + name + ".wav"
        ],
        $scope.finishedLoading
    );

    bufferLoader.load();
	}; 

	$scope.playNote = function(note){
	  if (recording) {
	  	var msFromStart = Math.round(new Date() - startTime);
	  	var distance = parseFloat(msFromStart/44).toFixed(2).toString() + '%';
			$scope.melody.push({
				name: note,
				time: msFromStart,
				distance: distance
			});
			$scope.$apply();
		}
		var name = changeName(note);
			bufferLoader = new BufferLoader(
	        context,
	        [
	        "notes/" + name + ".wav"
	        ],
	        $scope.finishedLoading
	    );

	    bufferLoader.load();
	    name +='note'
	    angular.element('.' + name).css('background-color', '#FFC30D');
				setTimeout(function() {
					angular.element('.' + name).css('background-color', '#000080');
				}, 140);
	};

	$scope.playBackNote = function(note){
		var name = changeName(note);
			bufferLoader = new BufferLoader(
	        context,
	        [
	        "notes/" + name + ".wav"
	        ],
	        $scope.finishedLoading
	    );

	    bufferLoader.load();
	};

	$scope.toggleRecording = function() {
		$scope.recordingNext = true;
	}

	$scope.clearMelody = function() { //clears melody
		$scope.melody = [];
	};

	$scope.clearChords = function() {
		$scope.chosenChords = [];
	};

	function playMelody() {
		$scope.melody.forEach(function(note) {
			setTimeout(function() {
				var test = note.name; 
				test = test.toLowerCase(); 
				if(test.length > 1){
					test = test.charAt(0); 
				}
				var name = $scope.newNote(note);  
				//changes text color of specific note being played
				angular.element('.' + test + '.'+name).css('color', 'black');
				setTimeout(function() {
					angular.element('.' + test + '.'+name).css('color', 'white');
				}, 140);
				$scope.playBackNote(note.name);
			}, note.time);
		});
	}
	
	function playChords() {
		$scope.chosenChords.forEach(function(chord, index) {
			setTimeout(function() {
				var name = $scope.assignClassName(chord.name);

				angular.element('.' + name).css('color', 'black');
				setTimeout(function() {
					angular.element('.' + name).css('color', 'white');
				}, 1100);
			
				$scope.playChord(chord); 
			}, index*1100);
		});
	}

	$scope.playSong = function() { //plays your chords + melody
		var loops = $('input[id="loopNumber"]').val();
		
		if ($scope.recordingNext) {
			$scope.recordingNext = false;
			recording = true;
			melody = [];
			startTime = new Date();
			setTimeout(function() {
				recording = false;
			}, 4400);
		}

		for(i=0; i<loops; i++) {
			setTimeout(function() {
				playMelody();
				playChords();
			}, (i * 4400));
		}
	};

	$scope.assignClassName = function(string) { //if input is string 'g sharp min', returns string 'gmin'
		string = string.toLowerCase();
		var className = string.charAt(0); //this shortened string is used as a class name for coloring purposes
		if (string.indexOf('maj') != -1) className += 'maj';
		if (string.indexOf('min') != -1) className += 'min';
		return className;
	}

	$scope.setNoteClass = function(string){
		string = string.toLowerCase();
		if(string.length > 1){
			string = string.charAt(0) + "shrp"; 
		}
		string += 'note'; 
		return string; 
	}

	$scope.newNote = function(note){
		var rename = note.name[0] + note.time; 
		return rename; 

	}

	$scope.swapPositions = function(index, chord) { //swap position of two chords when you drag a chord onto another chord
		if (chord.chosen) {
			var otherChord = $scope.chosenChords[index];
			var otherIndex = $scope.chosenChords.indexOf(chord);
			$scope.chosenChords[index] = chord;
			$scope.chosenChords[otherIndex] = otherChord;
		} else {
			$scope.addChord(chord);
		}
	}

	$scope.addChord = function(chord) { //adds chord to chosenChords array, re-renders avaible chords/notes
		$scope.inProgress = true;
		if ($scope.chosenChords.length < 4) {
			if (!chord.chosen) {
				chord.chosen = true;
				$scope.chosenChords.push(chord);
				filterKeys();
				filterNotes();
				filterChords();
			}
		}
	};

	$scope.removeChord = function(chord) { //removes chord from chosenChords, re-renders avaiable chords/notes
		chord.chosen = false;
		var index = $scope.chosenChords.indexOf(chord);
		$scope.chosenChords.splice(index, 1);
		filterKeys();
		filterNotes();
		filterChords();
		if ($scope.chosenChords.length == 0) $scope.inProgress = false;
	};

	function filterKeys() { //renders available keys based on chosenChords
		var notesUsed = []; //notes used in your chosen chords
		$scope.chosenChords.forEach(function(chord) {
			notesUsed.push(chord.notes);
		});
		notesUsed = [].concat.apply([], notesUsed); //flattens array
		$scope.allowedKeys = [];
		keys.forEach(function(key) {
			if (isArrayContained(notesUsed, key.notes)) {
				$scope.allowedKeys.push(key);
			} 
		});
	}

	function filterNotes() { //renders available notes based on chosenChords
		$scope.allowedNotes = [];
		$scope.allowedKeys.forEach(function(key) {
			key.notes.forEach(function(note) {
				if ($scope.allowedNotes.indexOf(note) == -1) $scope.allowedNotes.push(note);
			});
		});
		$scope.allowedNotes.sort();
	}

	function filterChords() { //renders available chords based on chosenChords
		$scope.allowedChords = [];
		$scope.chords.forEach(function(chord) {
			if (isArrayContained(chord.notes, $scope.allowedNotes)) {
				if ($scope.chosenChords.indexOf(chord) == -1) {
					chord.chosen = false;
					$scope.allowedChords.push(chord);
				} 
			}
		});
	}

	function isArrayContained(inner, outer) { //helper func for filter functions. checks if an array is entirely contained in another
		for(i=0; i<inner.length; i++) {
			if (outer.indexOf(inner[i]) == -1) return false;
		}
		return true;
	}

	$scope.reset = function() { //resets to initial state
		$scope.inProgress = false;
		$scope.allowedKeys = [];
		$scope.allowedNotes = [];
		$scope.allowedChords = [];
		$scope.chosenChords = [];

		$scope.initializeKeys();
	};

	$scope.initializeKeys = function() { //initial population of allowed keys
		$scope.allowedKeys = [];
		keys.forEach(function(key) {
			$scope.allowedKeys.push(key)
		});
	};


//end of main song app controller body
}]);

};

