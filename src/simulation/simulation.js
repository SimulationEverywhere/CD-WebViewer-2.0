'use strict';

import Evented from '../components/evented.js';
import Array from '../utils/array.js';
import Palette from './palettes/basic.js';
import Selection from './selection.js';
import State from './state.js';
import Cache from './cache.js';
import Frame from './frame.js';

export default class Simulation extends Evented { 
	
	get Size() { return this.size; }
	
	get Palette() { return this.palette; }
		
	get State() { return this.state; }

	get Selection() { return this.selection; }
	
	constructor() {
		super();
		
		this.frames = [];
		this.index = {};
		this.models = [];
		
		this.name = null;
		this.files = null;
		this.simulator = null;
		this.nFrames = null;
		this.lastFrame = null;
		
		this.state = null;
		this.palette = null;
		this.info = null;
		
		this.palette = new Palette();
		this.selection = new Selection();
		this.cache = new Cache();
		
		this.size = 0;
	}
	
	Initialize(info, settings) {
		this.simulator = info.simulator;
		this.name = info.name;
		this.files = info.files;
		this.lastFrame = info.lastFrame;
		this.nFrames = info.nFrames;
				
		this.BuildCache(settings.Cache);
		this.BuildDifferences();
		
		this.state = this.cache.First();
	}
	
	BuildCache(nCache) {
		var zero = State.Zero(this.models);
		
		this.cache.Build(nCache, this.frames, zero);
		
		this.state = this.cache.First();
	}
	
	BuildDifferences() {		
		var state = State.Zero(this.models);
		
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
	
	AddFrame(frame) {		
		this.frames.push(frame);
		
		this.index[frame.time] = frame;
		
		return frame;
	}
	
	Frame(i) {
		return this.frames[i];
	}
	
	Index(id) {
		return this.index[id];
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
	
	StartRecord() {
		this.Emit("RecordStart");
	}
	
	StopRecord() {
		this.Emit("RecordStop");
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
	
	LoopOnSize(delegate) {
		for (var i = 0; i < this.size; i++) {
			delegate(i);
		}
	}
}