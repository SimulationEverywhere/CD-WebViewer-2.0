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
	
	IsSelected(model) {
		return Array.Has(this.selected, function(s) { 
			return s == model;
		});
	}
	
	Select(model) {
		this.selected.push(model);
		
		this.Emit("Change", { model:model, selected:true });
	}
	
	Deselect(model) {
		var idx = Array.FindIndex(this.selected, function(s) { 
			return s == model;
		});
		
		this.selected.splice(idx, 1);
		
		this.Emit("Change", { model:model, selected:false });
	}
	
	Save() {
		return this.selected;
	}
	
	Load(config) {
		Array.ForEach(config, function(sel) {
			this.selected.push(sel);
		}.bind(this));
		
		this.Emit("Session", { selection:this });		
	}
}