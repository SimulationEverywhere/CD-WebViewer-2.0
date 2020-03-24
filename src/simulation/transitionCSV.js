'use strict';

export default class TransitionCSV { 

	constructor(frame, id, value, input, output, phase, coord, diff) {

		this.frame = frame;
		this.id = id;
		this.value = parseFloat(value);
		this.input = input;
		this.output = output;
		this.phase = phase;
		if(typeof coord === 'string')
		this.coord = coord.split('-').map(Number);
		else
		this.coord=coord;
		this.diff = diff;
	}

	get Frame() {
		return this.frame;
	}

	get Id() {
		return this.id;
	}
	
	get Value() {
		return this.value;
	}

	get Input() {
		return this.input;
	}
	
	get Output() {
		return this.output;
	}

	get Phase() {
		return this.phase;
	}

	get Coord() {
		return this.coord;
	}
	get X() {
		return this.coord[0];
	}

	get Y() {
		return this.coord[1];
	}
	
	get Z() {
		return this.coord[2];
	}

	get Diff() {
		return this.diff;
	}
	
	set Diff(value) {
		this.diff = value;
	}

	Reverse() {
		return new TransitionCSV(this.frame ,this.id, this.value - this.diff, this.input, this.output,this.phase, this.coord, this.diff);
	}

	static CoordToId(coord) {
		return coord.join("-");
	}
}
