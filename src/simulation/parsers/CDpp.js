'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Sim from '../../utils/sim.js';
import Frame from '../frame.js';
import TransitionCA from '../transitionCA.js';
import State from '../state.js';
import Parser from "./parser.js";
import Palette from '../palettes/basic.js';
import SimulationCA from '../simulationCA.js';
import ChunkReader from '../../components/chunkReader.js';

export default class CDpp extends Parser { 
	
	constructor(files) {
		super(files);
		
		this.val = new Frame("00:00:00:000");
		this.ma = new Frame("00:00:00:000");
	}
	
	IsValid() {
		var d = Lang.Defer();
		var log = Array.Find(this.files, function(f) { return f.name.match(/.log/i); });
		var ma = Array.Find(this.files, function(f) { return f.name.match(/.ma/i); });
		
		if (!log || !ma) d.Resolve(false);
			
		var r = new ChunkReader();
		
		r.ReadChunk(log, 200).then((ev) => d.Resolve(ev.result.indexOf("Mensaje ") >= 0));
		
		return d.promise;
	}
	
	Parse(files, settings) {
		var d = Lang.Defer();
		var simulation = new SimulationCA();
		
		var val = Array.Find(files, function(f) { return f.name.match(/.val/i); });
		var pal = Array.Find(files, function(f) { return f.name.match(/.pal/i); });
		var ma = Array.Find(files, function(f) { return f.name.match(/.ma/i); });
		var log = Array.Find(files, function(f) { return f.name.match(/.log/i); });
		
		var p1 = Sim.ParseFile(val, this.ParseValFile.bind(this, simulation));
		var p2 = Sim.ParseFile(pal, this.ParsePalFile.bind(this, simulation));
		var p3 = Sim.ParseFile(ma, this.ParseMaFile.bind(this, simulation));
		var p4 = Sim.ParseFileByChunk(log, this.ParseLogChunk.bind(this, simulation));
			
		var defs = [p1, p2, p3, p4];
	
		Promise.all(defs).then((data) => {
			var f = this.MergeFrames(this.ma, this.val);
			
			if (f.transitions.length > 0) {
				f.time = "00:00:00:000";
				simulation.frames.unshift(f);
				simulation.index[f.time] = f;
			}
			
			var info = {
				simulator : "CDpp",
				name : log.name.replace(/\.[^.]*$/, ''),
				files : files,
				lastFrame : simulation.LastFrame().time,
				nFrames : simulation.frames.length
			}
		
			// Build models array from size
			simulation.LoopOnSize((x,y,z) => { 
				simulation.models.push(TransitionCA.CoordToId([x,y,z]));
			});
			
			simulation.Initialize(info, settings);
		
			d.Resolve(simulation);
		});
		
		return d.promise;
	}
	
	MergeFrames(f1, f2) {
		// f2 over f1, modifies f1, who cares.
		f2.transitions.forEach(function(t2) {
			// frame 1 has transition id from frame 2, replace
			if (f1.index[t2.id])  {
				f1.index[t2.id].value = t2.value;
				f1.index[t2.id].diff = t2.diff;
			}
			
			// frame 1 doesn't have transition id from frame 2, add it
			else f1.AddTransition(t2);
		});
		
		return f1;
	}
	
	ParseValFile(simulation, file) {
		// Each line looks like this: (y,x,z)=value
		file.split(/\n/).forEach(function(line) {
			if (line.length < 4) return; // probably empty line
			
			var cI = line.indexOf('('); // coordinate start
			var cJ = line.indexOf(')'); // coordinate end
			var vI = line.indexOf('='); // value start
			
			if (cI == -1|| cJ == -1 || vI == -1) return; // invalid line
			
			var split = line.substring(cI + 1, cJ).split(',');
			var coord = this.GetCoord(split);
			var v = parseFloat(line.substr(vI + 1));
			
			this.val.AddTransition(new TransitionCA(coord, v));
		}.bind(this));
	}
	
	ParseMaFile(simulation, file) {
		// Dimensions		
		var dim = null;
		var raw = file.match(/dim\s*:\s*\((.+)\)/);
		
		if (raw) dim = raw[1].split(",")
		
		else {
			var raw_h = file.match(/height\s*:\s*(.+)/);
			var raw_w = file.match(/width\s*:\s*(.+)/);
			
			dim = [raw_h[1], raw_w[1]];
		}
		
		if (dim.length == 2) dim.push(1);
		
		simulation.size = [+dim[1], +dim[0], +dim[2]];
		
		var global = this.GlobalFrame(simulation, file);
		var rows = this.RowsFrame(file);
		
		this.ma = this.MergeFrames(global, rows);
	}
	
	GlobalFrame(simulation, file) {
		var f = new Frame("00:00:00:000");
		var raw = file.match(/initialvalue\s*:\s*(.+)/);
		
		if (!raw || raw[1] == "0") return f;
		
		simulation.LoopOnSize((x,y,z) => {  
			f.AddTransition(new TransitionCA([x, y, z], +raw[1]));
		});
		
		return f;
	}
	
	RowsFrame(file) {
		var f = new Frame("00:00:00:000");
		var raw = file.matchAll(/initialrowvalue\s*:\s*(.+)/g);
		
		if (!raw) return f;
		
		for (const r of raw) {
			var d = r[1].split(/\s+/);
			var values = d[1].split('');
			
			for (var x = 0; x < values.length; x++) {
				var v = +values[x];
				
				if (v == 0) continue;
					
				f.AddTransition(new TransitionCA([x, y, z], v));
			}
		}
		
		return f;
	}
	
	ParsePalFile(simulation, file) {	
		var lines = file.split(/\n/);
		simulation.palette = new Palette();
		
		if (lines[0].indexOf('[') != -1) this.ParsePalTypeA(simulation.palette, lines);
			
		else this.ParsePalTypeB(simulation.palette, lines);
	}	
	
	ParsePalTypeA(palette, lines) {
		// Type A: [rangeBegin;rangeEnd] R G B
		lines.forEach(function(line) { 
			// skip it it's probably an empty line
			if (line.length < 7) return;
			
			var begin = parseFloat(line.substr(1));
			var end   = parseFloat(line.substr(line.indexOf(';') + 1));
			var rgb = line.substr(line.indexOf(']') + 2).trim().split(' ');
			
			// clean empty elements
			for (var j = rgb.length; j-- > 0;) {
				if (rgb[j].trim() == "") rgb.splice(j, 1);
			}			
			
			// Parse as decimal int
			var r = parseInt(rgb[0], 10);
			var g = parseInt(rgb[1], 10);
			var b = parseInt(rgb[2], 10);
			
			palette.AddClass(begin, end, [r, g, b]);
		});
	}
	
	ParsePalTypeB(palette, lines) {
		// Type B (VALIDSAVEFILE: lists R,G,B then lists ranges)
		var paletteRanges = [];
		var paletteColors =[];
		
		for (var i = lines.length; i-->0;){
			// check number of components per line
			var components = lines[i].split(',');
			
			if(components.length == 2) {
			// this line is a value range [start, end]
				// Use parseFloat to ensure we're processing in decimal not oct
				paletteRanges.push([parseFloat(components[0]), parseFloat(components[1])]); 
			}
			else if (components.length == 3){ 
				//this line is a palette element [R,G,B]
				// Use parseInt(#, 10) to ensure we're processing in decimal not oct
				paletteColors.push([parseInt(.95*parseInt(components[0],10)), 
									parseInt(.95*parseInt(components[1],10)), 
									parseInt(.95*parseInt(components[2],10))]); 
			}
		}

		// populate grid palette object
		for (var i = paletteRanges.length; i-- > 0;){
			palette.AddClass(paletteRanges[i][0], paletteRanges[i][1], paletteColors[i]);
		}
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
		
		Array.ForEach(lines, function(line) {
			var split = line.split("/");
			
			// Parse coordinates
			var i = split[2].indexOf('(');
			var j = split[2].indexOf(')');
			var c = split[2].substring(i + 1, j).split(',');
			
			// TODO : Does this ever happen?
			if (c.length < 2) return;
			
			// Parse coordinates, state value & frame timestamp
			var coord = this.GetCoord(c);
			var val = parseFloat(split[4]);
			var fId = split[1].trim();
						
			var f = simulation.Index(fId) || simulation.AddFrame(new Frame(fId));
			
			f.AddTransition(new TransitionCA(coord, val));
		}.bind(this));
		
		this.Emit("Progress", { progress: progress });
	}
	
	GetCoord(sCoord) {
		// Parse coordinates
		var x = parseInt(sCoord[1],10);
		var y = parseInt(sCoord[0],10);
		var z = parseInt(sCoord.length==3 ? sCoord[2] : 0, 10);
		
		return [x, y, z];
	}
}