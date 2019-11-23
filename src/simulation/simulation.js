'use strict';

import Evented from '../components/evented.js';
import Array from '../utils/array.js';
import Palette from './palette.js';
import Selection from './selection.js';
import Info from './info.js';
import State from './state.js';
import Cache from './cache.js';
import Frame from './frame.js';

export default class Simulation extends Evented { 
	
	get Size() { return this.info.Size; }
	
	get Palette() { return this.palette; }
	
	get Info() { return this.info; }
	
	get State() { return this.state; }
	
	get Selection() { return this.selection; }
		
	constructor() {
		super();
		
		this.frames = [];
		this.index = {};
		
		this.state = null;
		this.palette = null;
		this.info = null;
		this.selection = null;
	}
	
	LoadData(nCache, data) {	
		this.LoadPalette(data.palette);
		this.LoadMessages(data.messages);
		this.LoadInfo(data.messages, data.parser);
		
		this.selection = new Selection();
		this.cache = new Cache();
		
		this.cache.Build(nCache, this.frames, this.info.size);
		
		this.state = this.cache.First();
		
		this.BuildDifferences();
	}
	
	LoadPalette(palette) {
		this.palette = palette;
	}
	
	LoadMessages(messages) {
		Array.ForEach(messages, function(m) {
			var frame = this.index[m.id];
			
			if (!frame) {
				frame = new Frame(m.id, m.time);
				
				this.index[frame.id] = frame;
				
				this.frames.push(frame);
			}
			
			frame.AddTransition(m.coord, m.value);
		}.bind(this));
	}
	
	LoadInfo(messages, parser) {
		this.info = new Info();
		
		this.info.Load(this, messages, parser);
	}
	
	BuildDifferences() {		
		var state = State.Zero(this.info.size);
		
		Array.ForEach(this.frames, function(f) { f.Difference(state); })
	}
	
	GetGridState(i) {
		if (i == this.frames.length - 1) return this.cache.Last();
		
		if (i == 0) return this.cache.First();
		
		var cached = this.cache.GetClosest(i);
					
		for (var j = cached.i + 1; j <= i; j++) {
			cached.ApplyTransitions(this.Frame(j));
		}
		
		return cached;
	}
	
	CurrentFrame() {
		return this.frames[this.state.i];
	}
	
	Frame(i) {
		return this.frames[i];
	}
	
	FirstFrame(i) {
		return this.frames[0];
	}
	
	LastFrame(i) {
		return this.frames[this.frames.length - 1];
	}
	
	GoToFrame(i) {
		this.state = this.GetGridState(i);
		
		this.Emit("Jump", { state:this.state });
	}
	
	GoToNextFrame() {
		var frame = this.Frame(this.state.i + 1);
		
		this.state.ApplyTransitions(frame);
		
		this.Emit("Move", { frame : frame, direction:"next" });
	}
	
	GoToPreviousFrame() {
		var frame = this.Frame(this.state.i);
		var reverse = frame.Reverse();
		
		this.state.RollbackTransitions(frame);
		
		this.Emit("Move", { frame : reverse, direction:"previous" });
	}
	
	Save() {
		return {
			i : this.state.i,
			selection : this.selection.Save(),
			palette : this.palette.Save()
		}
	}
	
	Load(config) {
		this.GoToFrame(config.i);
		
		this.selection.Load(config.selection);
		this.palette.Load(config.palette);
		
		this.Emit("Session", { simulation:this });
	}
	
	onSimulation_Error(message) {
		this.Emit("Error", { error:new Error(message) });
	}
}