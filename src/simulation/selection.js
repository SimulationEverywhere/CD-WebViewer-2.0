'use strict';

import State from './state.js';
import Array from '../utils/array.js';
import Evented from '../components/evented.js';

export default class Selection extends Evented { 

	get Selected() { return this.selected; }

	constructor() {
		super();

		this.selected = [];
	}
	
	IsSelected(x, y, z) {
		return Array.Has(this.selected, function(s) { 
			return s.x == x && s.y == y && s.z == z;
		});
	}
	
	Select(x, y, z) {
		this.selected.push({ x:x, y:y, z:z });
		
		this.Emit("Change", { x:x, y:y, z:z, selected:true });
	}
	
	Deselect(x, y, z) {
		var idx = Array.FindIndex(this.selected, function(s) { 
			return s.x == x && s.y == y && s.z == z;
		});
		
		this.selected.splice(idx, 1);
		
		this.Emit("Change", { x:x, y:y, z:z, selected:false });
	}
	
	Save() {
		return this.selected;
	}
	
	Load(config) {
		Array.ForEach(config, function(sel) {
			this.selected.push({ x:sel.x, y:sel.y, z:sel.z });
		}.bind(this));
		
		this.Emit("Session", { selection:this });		
	}
}