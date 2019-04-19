'use strict';

export default class Transition { 

	constructor(coord, value, diff) {
		this.id = `${coord.x},${coord.y},${coord.z}`;
		this.coord = coord;
		this.value = value;
		this.diff = diff;
	}
	
	get Coord() {
		return this.coord;
	}
	
	get X() {
		return this.coord.x;
	}
	
	get Y() {
		return this.coord.y;
	}
	
	get Z() {
		return this.coord.z;
	}
	
	get Value() {
		return this.value;
	}
	
	get Diff() {
		return this.diff;
	}
	
	set Diff(value) {
		this.diff = value;
	}
}