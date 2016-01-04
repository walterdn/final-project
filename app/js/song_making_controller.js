require('angular/angular');
var angular = window.angular;
var SongMaker = require('./../../models/song_maker');
var Chord = require('./../../models/group_of_notes');
var BufferLoader = require('./buffer_loader');
var helper = require('./helper_functions');

module.exports = function(app) {
	app.controller('SongMakingController', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.doneLoadingSounds = false;
	$scope.cleanSlate = true;

	var mySong = new SongMaker();
	$scope.allowedChords = mySong.getAllowedChords();
	$scope.chosenChords = mySong.getChosenChords();
	$scope.melody = mySong.getMelody();

	var bufferLoader;
	var context = new AudioContext();
	var startTimeOfRecording;
	var currentlyPlaying = false;
	var currentlyRecording = false;
	$scope.willRecordNextPlay = false;

	$scope.navigateTo = function(url) {
		$scope.reset();
		$location.path('/' + url);
	};

	$(window).keypress(function(e) { //plays notes upon keypresses of a, s, d, f, g, h, j, k, l, and space bar to play, r to record next. 
		if(!$scope.cleanSlate) {
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
			if (e.which == 114)	{
				$scope.toggleRecording();
				$scope.$apply();
			}
		}
	});

	$scope.playChord = function(chord){ //plays one chord sound
		var fileName = helper.removeSpaces(chord.getName());
		playSound('chords', fileName);
	}; 

	$scope.playNote = function(note) { //plays a single note, also records it to melody if you are recording
	  if (currentlyRecording) recordToMelody(note);
		
		var fileName = helper.replaceSharpSymbol(note);
		playSound('notes', fileName);

    highlightBackground(note);
	};

	function recordToMelody(note) { //saves an object to melody for each note you play while recording. stores WHICH note (name), and WHEN (time)
		var millisecondsFromStart = Math.round(new Date() - startTimeOfRecording);
		mySong.addNote(note, millisecondsFromStart);
		$scope.$apply();
	}

	function playBackNote(note) { //plays back a note from your recorded melody
		var fileName = helper.replaceSharpSymbol(note);
		playSound('notes', fileName);
	}

	function playSound(category, fileName) {
		bufferLoader = new BufferLoader(
			context,
			[category + '/' + fileName + '.mp3'],
			function (bufferList) { 
		    var sound = context.createBufferSource();
		    sound.buffer = bufferList[0];
		    sound.connect(context.destination);
		    sound.start(0);
			}
		);
		bufferLoader.load();
	}

	$scope.toggleRecording = function() { //will record 4 bars of melody notes after the next time you hit play
		if (!$scope.willRecordNextPlay) $scope.willRecordNextPlay = true;
		else $scope.willRecordNextPlay = false;
	}

	function playMelody() { //plays your recorded melody
		$scope.melody.forEach(function(note) {
			setTimeout(function() {
				highlightBorder('note', note);
				playBackNote(note.name);
			}, note.time);
		});
	}
	
	function playChords() { //plays your chord progression
		$scope.chosenChords.forEach(function(chord, index) {
			setTimeout(function() {
				highlightBorder('chord', chord);
				$scope.playChord(chord); 
			}, index*1100);
		});
	}

	$scope.playSong = function() { //plays your chords + melody
		var loops = $('input[id="loopNumber"]').val();

		if (!currentlyPlaying) {
			currentlyPlaying = true;
			setTimeout(function() {
				currentlyPlaying = false;
			}, (4400 * loops));

			if ($scope.willRecordNextPlay) {
				$scope.willRecordNextPlay = false;
				currentlyRecording = true;
				startTimeOfRecording = new Date();
				setTimeout(function() {
					currentlyRecording = false;
				}, 4400);
			}

			for(i=0; i<loops; i++) {
				setTimeout(function() {
					playMelody();
					playChords();
				}, (i * 4400));	
			}
		}
	};

	$scope.swapOrAdd = function(index, dragData) { //swap position of two chords when you drag a chosen chord onto another chosen chord
		if (dragData.source === 'chosen') {
			var otherIndex = $scope.chosenChords.indexOf(dragData.chord);
			mySong.swapChordPositions(index, otherIndex);
		} else {
			$scope.addChord(dragData);
		}
	}

	$scope.addChord = function(dragData) { //adds chord to chosenChords array, re-renders avaible chords/notes
		if (dragData.source === 'choices') {
			$scope.cleanSlate = false;
			mySong.addChord(dragData.chord);
			filter();
		}
	};	

	$scope.removeChord = function(index) { //removes chord from chosenChords, re-renders avaiable chords/notes
		mySong.removeChord(index);
		filter();

		if ($scope.chosenChords.length === 0) $scope.reset();
	};

	$scope.removeNote = function(index) {
		mySong.removeNote(index);
	};

	$scope.reset = function() { //resets to initial state
		$scope.cleanSlate = true;
		$scope.chosenChords = mySong.resetChords();
		$scope.melody = mySong.resetMelody();
		filter();
	};

	$scope.clearMelody = function() {
		$scope.melody = mySong.resetMelody();
	};

	function filter() { //filters allowed keys, allowed notes, and allowed chords, based on chosen chords
		$scope.allowedKeys = mySong.getAllowedKeys();
		$scope.allowedNotes = mySong.getAllowedNotes();
		$scope.allowedChords = mySong.getAllowedChords();
	}

	function highlightBackground(note) { //temporarily highlights background of one of the allowed notes
		var className = $scope.setNoteClass(note);
		angular.element('.' + className).css('background', '#ffbf00');
		setTimeout(function() {
			angular.element('.' + className).css('background', '#7F7F7A');
		}, 180);
	}

	function highlightBorder(type, item) { //temporarily highlights border of a chosen chord or a melody note
		if (type === 'note') {
			var className = $scope.setNoteClass2(item); 
			angular.element('.' + className).css('border', '3px solid #ff9900');
			setTimeout(function() {
				angular.element('.' + className).css('border', 'none');
			}, 250);
		}
		if(type === 'chord') {
			var className = $scope.assignClassName(item.getName());
			angular.element('.' + className).css('border', '2px solid #ff9900');
			setTimeout(function() {
				angular.element('.' + className).css('border', '1px solid black');
			}, 1040);
		}
	}

	$scope.calculateMarginFromTime = function(time) { //if input is 2200 (the total time of 4bars is 4400ms), this method returns string 50%
		return parseFloat(time/44).toFixed(2).toString() + '%';
	};

	$scope.assignClassName = function(string) { //if input is 'f sharp maj', returns 'fmaj'
		string = string.toLowerCase(); //this shortened string is used as a class name for applying background colors of chords and notes
		var className = string.charAt(0); 
		if (string.indexOf('maj') !== -1) className += 'maj';
		if (string.indexOf('min') !== -1) className += 'min';
		return className;
	};

	$scope.setNoteClass = function(string) { //used to target a specific note in allowedNotes
		return helper.replaceSharpSymbol(string) + 'note'; //for the purpose of briefly highlighting that note's background upon play
	};

	$scope.setNoteClass2 = function(note) { //used to target a specific note in your melody
		var rename = note.name[0] + note.time;  //for the purpose of briefly highlighting that note's border upon playback
		return rename; 
	};

	$scope.loadASong = function() { //loads a saved song if one has been loaded into songLoader
		$scope.reset();
		var song = $scope.songLoader(); //comes from a global app variable stored in auth_controller.js
		if (song) {
			song.chords.forEach(chord => {
				mySong.addChord(new Chord(chord.name, chord.notes));
			});
			$scope.melody = mySong.setMelody(song.melody);
			filter();
			$scope.cleanSlate = false;
			$scope.songLoader('clearSongLoader');
			$scope.$apply();
		}
	};

	$scope.saveSong = function() { //saves your chord progression + melody to the database
		var savableChordObjects = [];
    mySong.getChosenChords().forEach(chord => savableChordObjects.push({
    	name: chord.getName(),
    	notes: chord.getNotes()
    }));

		if (!$scope.currentUser) {

			$scope.songLoader({ //temporarily stores song so user will have access to it after logging in
				chords: savableChordObjects,
				melody: mySong.getMelody()
			});
			alert('Must be logged in to save songs (your song will still be here after you login).');
			$scope.navigateTo('signin');

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
	        				chords: savableChordObjects, 
	        				melody: mySong.getMelody()
	        			}
	      };

	      $http(req).then(successCb, errorCb);
		  }
		}
	};

	function loadAllSounds() { //loads all sounds into buffer on pageload
		bufferLoader = new BufferLoader(
      context,
      [
      "chords/amaj.mp3",
      "chords/amin.mp3",
      "chords/bflatmaj.mp3",
      "chords/bflatmin.mp3",
      "chords/bmaj.mp3",
      "chords/bmin.mp3",
      "chords/cmaj.mp3",
      "chords/cmin.mp3",
      "chords/csharpmaj.mp3",
      "chords/csharpmin.mp3",
      "chords/dmaj.mp3",
      "chords/dmin.mp3",
      "chords/eflatmaj.mp3",
      "chords/eflatmin.mp3",
      "chords/emaj.mp3",
      "chords/emin.mp3",
      "chords/fmaj.mp3",
      "chords/fmin.mp3",
      "chords/fsharpmaj.mp3",
      "chords/fsharpmin.mp3",
      "chords/gmaj.mp3",
      "chords/gmin.mp3",
      "chords/gsharpmaj.mp3",
      "chords/gsharpmin.mp3",
      "notes/a.mp3",
      "notes/ashrp.mp3",
      "notes/b.mp3",
      "notes/c.mp3",
      "notes/cshrp.mp3",
      "notes/d.mp3",
      "notes/dshrp.mp3",
      "notes/e.mp3",
      "notes/f.mp3",
      "notes/fshrp.mp3",
      "notes/g.mp3",
      "notes/gshrp.mp3"
      ], 
      function(bufferList) {
      	var sound = context.createBufferSource();
  			sound.buffer = bufferList[0];
  			sound.connect(context.destination);
      	$scope.doneLoadingSounds = true;
      	$scope.$apply();
      }
    );

    bufferLoader.load();
	};

	loadAllSounds();

//end of main song app controller body
}]);

};

