'use strict';

import Basic from './basic.js';
import Array from '../../utils/array.js';
import Sim from '../../utils/sim.js';

const SELECTED_COLOR = "red";

export default class Palette extends Basic { 
	
	constructor() {
		super();
	}
	
	GetColor(value) {
		return this.gradient(value);
	}
	
	Buckets(n, cMin, cMax, vMin, vMax) {
		var colors = [];
		var c1 = Sim.HexToRgb(cMin);
		var c2 = Sim.HexToRgb(cMax);
				
		var dR = (c2[0] - c1[0]) / (n - 1);
		var dG = (c2[1] - c1[1]) / (n - 1);
		var dB = (c2[2] - c1[2]) / (n - 1);
		
		for (var i = 0; i < n; i++) {
			var r = Math.floor(c1[0] + dR * i);
			var g = Math.floor(c1[1] + dG * i);
			var b = Math.floor(c1[2] + dB * i);
			
			colors.push(Sim.RgbToHex([r,g,b]));
		}
				
		this.gradient = d3.scaleQuantile().domain([vMin, n, vMax]).range(colors);
	}
}
				