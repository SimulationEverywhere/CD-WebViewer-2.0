'use strict';

import Transition from './transition.js';

export default class TransitionCA extends Transition { 

	static CoordToId(coord) {
		return coord.join("-");
	}

	constructor(coord, value, diff) {
		var id = TransitionCA.CoordToId(coord);
		
		super(id, value, diff);
		
		this.coord = coord;
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
	
	Reverse() {
		return new TransitionCA(this.coord, this.value - this.diff, this.diff);
	}
}