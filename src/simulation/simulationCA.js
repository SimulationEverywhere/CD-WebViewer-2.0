'use strict';

import Simulation from './simulation.js';
import TransitionCA from './TransitionCA.js';

export default class SimulationCA extends Simulation { 
	
	
	constructor() {
		super();
		
		this.size = [0,0,0];
	}
	
	LoopOnSize(delegate) {
		for (var x = 0; x < this.size[0]; x++) {
			for (var y = 0; y < this.size[1]; y++) {
				for (var z = 0; z < this.size[2]; z++) {
					delegate(x, y, z);
				}
			}
		}
	}
}