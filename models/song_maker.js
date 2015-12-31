var Chord = require('./group_of_notes');
var Key = require('./group_of_notes');
var helper = require('./../app/js/helper_functions');

var SongMaker = function() {
	var MAX_NUM_CHORDS = 4;
	var chosenChords = [];

	var allChords = [
		new Chord('c maj', ['C', 'E', 'G']),
		new Chord('c min', ["C", "D#", "G"]),
		new Chord('c sharp maj', ["C#", "F", "G#"]),
		new Chord('c sharp min', ["C#", "E", "G#"]),	
		new Chord('d maj', ["D", "F#", "A"]),
		new Chord('d min', ["D", "F", "A"]),
		new Chord('e flat maj', ["D#", "G", "A#"]),
		new Chord('e flat min', ["D#", "F#", "A#"]),
		new Chord('e maj', ["E", "G#", "B"]),
		new Chord('e min', ["E", "G", "B"]),
		new Chord('f maj', ["F", "A", "C"]),
		new Chord('f min', ["F", "G#", "C"]),
		new Chord('f sharp maj', ["F#", "A#", "C#"]),
		new Chord('f sharp min', ["F#", "A", "C#"]),
		new Chord('g maj', ["G", "B", "D"]),
		new Chord('g min', ["G", "A#", "D"]),
		new Chord('g sharp maj', ["G#", "C", "D#"]),
		new Chord('g sharp min', ["G#", "B", "D#"]),
		new Chord('a maj', ["A", "C#", "E"]),
		new Chord('a min', ["A", "C", "E"]),
		new Chord('b flat maj', ["A#", "D", "F"]),
		new Chord('b flat min', ["A#", "C#", "F"]),
		new Chord('b maj', ["B", "D#", "F#"]),
		new Chord('b min', ["B", "D", "F#"])
	];

	var allKeys = [
		new Key('A Major/F# Minor', ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']),
		new Key('Bb Major/G Minor', ['A#', 'C', 'D', 'D#', 'F', 'G', 'A']),
		new Key('B Major/G# Minor', ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']),
		new Key('C Major/A Minor', ['C', 'D', 'E', 'F', 'G', 'A', 'B']),
		new Key('C# Major/Bb Minor', ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C']),
		new Key('D Major/B Minor', ['D', 'E', 'F#', 'G', 'A', 'B', 'C#']),
		new Key('Eb Major/C Minor', ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D']),
		new Key('E Major/C# Minor', ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#']),
		new Key('F Major/D Minor', ['F', 'G', 'A', 'A#', 'C', 'D', 'E']),
		new Key('F# Major/D# Minor', ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F']),
		new Key('G Major/E Minor', ['G', 'A', 'B', 'C', 'D', 'E', 'F#']),
		new Key('Ab Major/F Minor', ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G'])
	];

	this.addChord = chord => {
		if (chosenChords.length < MAX_NUM_CHORDS) {
			chosenChords.push(chord);
		}
	};

	this.removeChord = index => {
		chosenChords.splice(index, 1);
	};

	this.swapChordPositions = (firstIndex, secondIndex) => {
		var temp = chosenChords[firstIndex];
		chosenChords[firstIndex] = chosenChords[secondIndex];
		chosenChords[secondIndex] = temp;
	};

	this.resetChords = () => {
		chosenChords = [];
		return chosenChords;
	};

	this.getChosenChords = () => {
		return chosenChords;
	};

	this.getAllowedKeys = () => {
		var allowedKeys = [];
		var notesUsed = [];

		chosenChords.forEach(chord => notesUsed.push(chord.getNotes()));
		notesUsed = [].concat.apply([], notesUsed); //flattens notesUsed array

		allKeys.forEach(key => {
			if (helper.isArrayContained(notesUsed, key.getNotes())) {
				allowedKeys.push(key);
			}
		});

		return allowedKeys;
	};

	this.getAllowedNotes = () => {
		var allowedNotes = [];
		var allowedKeys = this.getAllowedKeys();

		allowedKeys.forEach(key => {
			key.getNotes().forEach(note => {
				if (allowedNotes.indexOf(note) === -1) {
					allowedNotes.push(note);
				}
			});
		});

		allowedNotes.sort();

		return allowedNotes;
	};

	this.getAllowedChords = () => {
		var allowedChords = [];
		var allowedNotes = this.getAllowedNotes();

		allChords.forEach(chord => {
			if (helper.isArrayContained(chord.getNotes(), allowedNotes)) {
				allowedChords.push(chord);
			}
		});

		return allowedChords;
	};

};

module.exports = exports = SongMaker;