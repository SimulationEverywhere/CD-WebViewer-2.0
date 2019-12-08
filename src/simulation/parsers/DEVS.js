'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Sim from '../../utils/sim.js';
import Simulation from '../simulation.js';
import Frame from '../frame.js';
import Transition from '../transition.js';
import Parser from "./parser.js";
import ChunkReader from '../../components/chunkReader.js';

export default class DEVS extends Parser { 
		
	constructor(fileList) {
		super(fileList);
		this.frames = [];
	}
		
	IsValid() {		
		var d = Lang.Defer();
		var log = Array.Find(this.files, function(f) { return f.name.match(/\.log/i); });
		var ma = Array.Find(this.files, function(f) { return f.name.match(/\.ma/i); });
		
		// TODO : This should reject
		if (!log || !ma) {
			d.Resolve(false);

			return d.promise;
		}
		
		var reader = new ChunkReader();
		
		reader.ReadChunk(ma, 400).then((ev) => {
			var type = ev.result.match(/type\s*:\s*(.+)/);
			
			d.Resolve(type == null);
		});
		
		return d.promise;
	}
	
	Parse(files, settings) {
		var d = Lang.Defer();
		var simulation = new Simulation();
		
		var ma = Array.Find(files, function(f) { return f.name.match(/\.ma/i); });
		var log = Array.Find(files, function(f) { return f.name.match(/\.log/i); });
		
		var p1 = Sim.ParseFile(ma, this.ParseMaFile.bind(this, simulation));
		var p2 = Sim.ParseFileByChunk(log, this.ParseLogChunk.bind(this, simulation));
			
		var defs = [p1, p2];
	
		Promise.all(defs).then((data) => {
			
			var info = {
				simulator : "DEVS",
				name : log.name.replace(/\.[^.]*$/, ''),
				files : files,
				lastFrame : simulation.LastFrame().time,
				nFrames : simulation.frames.length
			}
			
			simulation.size = this.ma.models.length;
			simulation.models = this.ma.models;
			
			simulation.Initialize(info, settings);

			d.Resolve(simulation);
		});
		
		return d.promise;
	}
	
	ParseMaFile(simulation, file) {
		var models = file.match(/(?<=\[).+?(?=\])/g);
		
		this.ma = { 
			models : Array.Map(models, (m) => { return m.toLowerCase(); })
		};
	}
	
	ParseLogChunk(simulation, chunk, progress) {		
		var lines = [];
		var start = chunk.indexOf('Mensaje Y', 0);
							
		while (start > -1 && start < chunk.length) {			
			var end = chunk.indexOf('\n', start);
			
			if (end == -1) end = chunk.length + 1;
			
			var length = end - start;
			
			lines.push(chunk.substr(start, length));

			var start = chunk.indexOf('Mensaje Y', start + length);
		}
		
		var safe = [];
		
		Array.ForEach(lines, function(line) {
			var split = line.split("/");
			
			// Parse model id
			var i = split[2].indexOf('(');
			var id = split[2].substring(0, i).trim();
			
			if (id.length < 1) return;
			
			// Parse state value, timestamp used as frame id
			var v = parseFloat(split[4]);
			var fId = split[1].trim();
						
			var f = simulation.Index(fId) || simulation.AddFrame(new Frame(fId));

			f.AddTransition(new Transition(id, v));
		}.bind(this));
		
		this.Emit("Progress", { progress: progress });
	}
}