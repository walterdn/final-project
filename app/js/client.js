require('angular/angular');
var angular = window.angular;
var BufferLoader = require('./buffer-loader');
var helper = require('./helper');

module.exports = function(app) {
	app.controller('MusicController', ['$scope', '$http', '$location', '$cookies', function($scope, $http, $location, $cookies) {
	var keys = [
		{name: 'A Major/F# Minor', notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']},
		{name: 'Bb Major/G Minor', notes: ['A#', 'C', 'D', 'D#', 'F', 'G', 'A']},
		{name: 'B Major/G# Minor', notes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']},
		{name: 'C Major/A Minor', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B']},
		{name: 'C# Major/Bb Minor', notes: ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C']},
		{name: 'D Major/B Minor', notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#']},
		{name: 'Eb Major/C Minor', notes: ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D']},
		{name: 'E Major/C# Minor', notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#']},
		{name: 'F Major/D Minor', notes: ['F', 'G', 'A', 'A#', 'C', 'D', 'E']},
		{name: 'F# Major/D# Minor', notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F']},
		{name: 'G Major/E Minor', notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#']},
		{name: 'G# Major/F Minor', notes: ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G']}
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

	$scope.context; 
	$scope.bufferLoader;
	context = new AudioContext();
	$scope.doneLoadingSounds = false;


	$scope.loadSounds = function(){ //loads all sounds into buffer on pageload
		bufferLoader = new BufferLoader(
        context,
        [
        "chords/amaj.wav",
        "chords/amin.wav",
        "chords/bflatmaj.wav",
        "chords/bflatmin.wav",
        "chords/bmaj.wav",
        "chords/bmin.wav",
        "chords/cmaj.wav",
        "chords/cmin.wav",
        "chords/csharpmaj.wav",
        "chords/csharpmin.wav",
        "chords/dmaj.wav",
        "chords/dmin.wav",
        "chords/eflatmaj.wav",
        "chords/eflatmin.wav",
        "chords/emaj.wav",
        "chords/emin.wav",
        "chords/fmaj.wav",
        "chords/fmin.wav",
        "chords/fsharpmaj.wav",
        "chords/fsharpmin.wav",
        "chords/gmaj.wav",
        "chords/gmin.wav",
        "chords/gsharpmaj.wav",
        "chords/gsharpmin.wav",
        "notes/a.wav",
        "notes/ashrp.wav",
        "notes/b.wav",
        "notes/c.wav",
        "notes/cshrp.wav",
        "notes/d.wav",
        "notes/dshrp.wav",
        "notes/e.wav",
        "notes/f.wav",
        "notes/fshrp.wav",
        "notes/g.wav",
        "notes/gshrp.wav"
        ], function(bufferList) {
        	var sound = context.createBufferSource();
    			sound.buffer = bufferList[0];
    			sound.connect(context.destination);
        	$scope.doneLoadingSounds = true;
        	$scope.$apply();
        }
    );

    bufferLoader.load();
	}

	$scope.loadSounds(); 

	$scope.inProgress = false;
	$scope.allowedKeys = [];
	$scope.allowedNotes = [];
	$scope.allowedChords = [];
	$scope.chosenChords = [];
	$scope.melody = [];

	var startTime;
	var recording = false;
	$scope.recordingNext = false;

	$scope.loadASong = function() { //loads a saved song
		$scope.reset();
		var song = ($scope.songLoader()); //comes from a global app variable stored in auth_controller.js
		if (song) {
			$scope.chosenChords = song.chords;
			$scope.melody = song.melody;
			filter();
			$scope.inProgress = true;
			$scope.$apply();
		}
	};

	$scope.viewSongs = function() {
		$scope.reset();
		$location.path('/savedsongs');
	};

	$scope.logOut = function() {
		$scope.reset();
    $scope.token = null;
    $scope.currentUser = null;
    $cookies.remove('token');
    $location.path('/signin');
  };

	$(window).keypress(function(e) { //plays notes upon keypresses of a, s, d, f, g, h, j, k, l, and space bar to play. 
		if (e.which == 97) $scope.playNote($scope.allowedNotes[0]);//breaks if you ever leave the main page then come back to it in the same session
		if (e.which == 115) $scope.playNote($scope.allowedNotes[1]);
		if (e.which == 100) $scope.playNote($scope.allowedNotes[2]);
		if (e.which == 102) $scope.playNote($scope.allowedNotes[3]);
		if (e.which == 103) $scope.playNote($scope.allowedNotes[4]);
		if (e.which == 104) $scope.playNote($scope.allowedNotes[5]);
		if (e.which == 106) $scope.playNote($scope.allowedNotes[6]);
		if (e.which == 107) $scope.playNote($scope.allowedNotes[7]);
		if (e.which == 108) $scope.playNote($scope.allowedNotes[8]);
		
		if (e.which == 32) $scope.playSong();
		if (e.which == 114)	{
			$scope.toggleRecording();
			$scope.$apply();
		}
	});

	$scope.saveSong = function() { //saves your chord progression + melody to the database
		if(!$scope.currentUser) {
			alert('Must be logged in to save songs.');
		} else {
			var songName = prompt("Name your masterpiece:", "");
 		  if (songName != null) {
	 		  var successCb = function(res) {
	        console.log('Song saved.')
	      };
	      var errorCb = function(err) {
	        console.log('Save failed.');   
	      };
	      var req = {
	        method: 'POST',
	        url:'/api/savesong/',
	        data: {	name: songName, 
	        				composer: $scope.currentUser, 
	        				chords: $scope.chosenChords, 
	        				melody: $scope.melody
	        			}
	      };

	      $http(req).then(successCb, errorCb);
		  }
		}
	};

	$scope.finishedLoading = function(bufferList) { //audio playing function
    //Create source for audio context
    var sound = context.createBufferSource();
    sound.buffer = bufferList[0];
    sound.connect(context.destination);
    sound.start(0);
	};


	$scope.playChord = function(chord){ //plays one chord sound
		var name = helper.removeSpaces(chord.name);
		bufferLoader = new BufferLoader(
        context,
        [
        "chords/" + name + ".wav"
        ],
        $scope.finishedLoading
    );

    bufferLoader.load();
	}; 

	$scope.playNote = function(note){ //plays a single note, also records it to melody if you are recording
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
		var name = helper.changeName(note);
			bufferLoader = new BufferLoader(
	        context,
	        [
	        "notes/" + name + ".wav"
	        ],
	        $scope.finishedLoading
	    );

	    bufferLoader.load();
	    name +='note'
	    angular.element('.' + name).css('background', '#ffbf00');
				setTimeout(function() {
					angular.element('.' + name).css('background', '#7F7F7A');
				}, 170);
	};

	$scope.playBackNote = function(note){ //plays back a note from your recorded melody
		var name = helper.changeName(note);
			bufferLoader = new BufferLoader(
	        context,
	        [
	        "notes/" + name + ".wav"
	        ],
	        $scope.finishedLoading
	    );

	    bufferLoader.load();
	};

	$scope.toggleRecording = function() { //will record 4 bars of melody notes after the next time you hit play
		if (!$scope.recordingNext) $scope.recordingNext = true;
		else $scope.recordingNext = false;
	}

	function playMelody() { //plays your recorded melody
		$scope.melody.forEach(function(note) {
			setTimeout(function() {
				var test = note.name; 
				test = test.toLowerCase(); 
				if(test.length > 1){
					test = test.charAt(0); 
				}
				var name = $scope.setNoteClass2(note);  
				//changes text color of specific note being played
				angular.element('.' + test + '.' + name).css('border', '3px solid #ff9900');
				setTimeout(function() {
					angular.element('.' + test + '.' + name).css('border', 'none');
				}, 240);
				$scope.playBackNote(note.name);
			}, note.time);
		});
	}
	
	function playChords() { //plays your chord progression
		$scope.chosenChords.forEach(function(chord, index) {
			setTimeout(function() {
				var name = $scope.assignClassName(chord.name);

				angular.element('.' + name).css('border', '2px solid #ff9900');
				setTimeout(function() {
					angular.element('.' + name).css('border', '1px solid black');
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
				filter();
			}
		}
	};

	$scope.removeChord = function(chord) { //removes chord from chosenChords, re-renders avaiable chords/notes
		chord.chosen = false;
		var index = $scope.chosenChords.indexOf(chord);
		$scope.chosenChords.splice(index, 1);
		if ($scope.chosenChords.length == 0) $scope.reset();
		else filter();
	};


	$scope.reset = function() { //resets to initial state
		$scope.inProgress = false;
		$scope.allowedKeys = [];
		$scope.allowedNotes = [];
		$scope.allowedChords = [];
		$scope.chosenChords = [];
		$scope.melody = [];
	};

	function filter() {
		filterKeys();
		filterNotes();
		filterChords();
	}


	function filterKeys() { //renders available keys based on chosenChords
		var notesUsed = []; //notes used in your chosen chords
		$scope.chosenChords.forEach(function(chord) {
			notesUsed.push(chord.notes);
		});
		notesUsed = [].concat.apply([], notesUsed); //flattens array
		$scope.allowedKeys = [];
		keys.forEach(function(key) {
			if (helper.isArrayContained(notesUsed, key.notes)) {
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
			if (helper.isArrayContained(chord.notes, $scope.allowedNotes)) {
				if ($scope.chosenChords.indexOf(chord) == -1) {
					chord.chosen = false;
					$scope.allowedChords.push(chord);
				} 
			}
		});
	}

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

	$scope.setNoteClass2 = function(note){
		var rename = note.name[0] + note.time; 
		return rename; 
	}

//end of main song app controller body
}]);

};

