'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Evented from '../../components/evented.js';
import ChunkReader from '../../components/chunkReader.js';
import Frame from '../frame.js';
import Simulation from '../simulation.js';
import Info from '../info.js';

const PARSERS = [];

export default class Parser extends Evented { 

	get FileNames() { 	
		var names = [];
		
		for (var id in this.files) {
			if (this.files[id]) names.push(this.files[id].raw.name);
		}
		
		return names;
	}
	
	get Type() { 
		throw new Error("Parsers must implement a get accessor for Type");
	}
	
	get ModelName() { 
		throw new Error("Parsers must implement a get accessor for ModelName");
	}
	
	constructor() {
		super();
	}

	GetFiles(fileList) {	
		throw new Error("Parsers must implement a GetFiles(fileList) function");
	}
	
	IsValid() {
		throw new Error("Parsers must implement a IsValid() function");
	}
	
	GetSimulationInfo() {
		throw new Error("Parsers must implement a GetSimulationInfo() function");
	}
	
	GetPalette() {
		throw new Error("Parsers must implement a GetPalette() function");
	}
	
	GetMessages() {
		throw new Error("Parsers must implement a GetMessages() function");
	}
	
	GetSize() {
		throw new Error("Parsers must implement a GetSize() function");
	}
	
	GetFrames() {
		var messages = this.GetMessages();
		var index = {};
		var frames = [];
		
		Array.ForEach(messages, function(m) {
			var frame = index[m.id];
			
			if (!frame) {
				frame = new Frame(m.id, m.time);
				
				index[frame.id] = frame;
				
				frames.push(frame);
			}
			
			frame.AddTransition(m.coord, m.value);
		});
		
		return { index:index, frames:frames }
	}

	ParseTasks(settings) {
		throw new Error("Parsers must implement a ParseTasks() function");
	}
	
	Parse(settings) {
		var d = Lang.Defer();
		var defs = this.ParseTasks();
	
		Promise.all(defs).then((data) => {
			var simulation = new Simulation()
			var results = this.GetFrames();
			
			simulation.palette = this.GetPalette();
			simulation.frames = results.frames;
			simulation.index = results.index;
			simulation.info = new Info();
			
			simulation.info.Load(simulation, this);
			simulation.BuildCache(settings.Cache);
			simulation.state = simulation.cache.First();
			simulation.BuildDifferences();
		
			d.Resolve(simulation);
		});
		
		return d.promise;
	}
	
	Initialize(fileList) {
		this.files = this.GetFiles(fileList);
		
		return this.IsValid();
	}
}