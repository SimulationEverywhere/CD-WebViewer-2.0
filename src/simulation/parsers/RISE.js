'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Sim from '../../utils/sim.js';
import Simulation from '../simulation.js';
import Frame from '../frame.js';
import Parser from "./parser.js";
import ChunkReader from '../../components/chunkReader.js';

export default class RISE extends Parser { 
	
	constructor(files) {
		super(files);
	}
	
	IsValid() {		
		var d = Lang.Defer();
		var log = Array.Find(this.files, function(f) { return f.name.match(".log"); });
		
		if (!log) d.Resolve(null);
			
		var r = new ChunkReader();
		
		r.ReadChunk(log, 200).then((ev) =>  d.Resolve(ev.result.indexOf("0 / L / ") >= 0));
		
		return d.promise;
	}
	
	Parse(files, settings) {
		var d = Lang.Defer();
		var simulation = new Simulation();
		
		var log = Array.Find(files, function(f) { return f.name.match(/.log/i); });

		var p = Sim.ParseFileByChunk(log, this.ParseLogChunk.bind(this, simulation));
			
		var defs = [p];
	
		Promise.all(defs).then((data) => {
			var info = {
				simulator : "RISE",
				name : log.name.replace(/\.[^.]*$/, ''),
				files : files,
				lastFrame : simulation.LastFrame().id,
				nFrames : simulation.frames.length
			}
			
			simulation.Initialize(info, settings);
		
			d.Resolve(simulation);
		});
		
		return d.promise;
	}
		
	ParseLogChunk(simulation, chunk, progress) {
		var lines = [];
		var start = chunk.indexOf('0 / L / Y', 0);
							
		while (start > -1 && start < chunk.length) {			
			var end = chunk.indexOf('\n', start);
			
			if (end == -1) end = chunk.length + 1;
			
			var length = end - start;
			
			lines.push(chunk.substr(start, length));

			var start = chunk.indexOf('0 / L / Y', start + length);
		}
				
		Array.ForEach(lines, function(line) {
			var split = line.split("/");
			
			// Parse coordinates
			var i = split[4].indexOf('(');
			var j = split[4].indexOf(')');
			var c = split[4].substring(i + 1, j).split(',');
			
			// TODO : Does this ever happen?
			if (c.length < 2) return;

			var coord = { x:parseInt(c[1],10), y:parseInt(c[0],10), z:parseInt(c.length==3 ? c[2] : 0, 10) }
			
			// Parse state value
			var v = parseFloat(split[6]);
			
			// Parse Timestamp
			var idx = split[3].trim();
			
			var time = Array.Map(idx.split(":"), function(t) { return +t; });
			
			var f = simulation.Index(idx) || simulation.AddFrame(idx, time);
			
			f.AddTransition(coord, v);
		});
		
		this.Emit("Progress", { progress: progress });
	}
}