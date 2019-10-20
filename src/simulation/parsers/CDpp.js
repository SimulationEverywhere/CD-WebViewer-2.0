'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Sim from '../../utils/sim.js';
import Message from '../message.js';
import Frame from '../frame.js';
import Parser from "./parser.js";
import Palette from '../palette.js';
import ChunkReader from '../../components/chunkReader.js';

export default class CDpp extends Parser { 
	
	get Type() { return "CD++"; }
	
	get ModelName() { 
		var i = this.files.log.raw.name.lastIndexOf(".");
		
		return this.files.log.raw.name.substr(0, i); 
	}
	
	constructor(fileList) {
		super(fileList);
	}
	
	GetFiles (fileList) {
		return {
			log : Array.Find(fileList, function(f) { return f.name.match(/.log/i); }),
			val : Array.Find(fileList, function(f) { return f.name.match(/.val/i); }),
			pal : Array.Find(fileList, function(f) { return f.name.match(/.pal/i); }),
			ma : Array.Find(fileList, function(f) { return f.name.match(/.ma/i); })
		}
	}
	
	IsValid() {		
		var d = Lang.Defer();
		
		if (!this.files.log) d.Reject(new Error(`CD++ Parser is not valid for the selected files.` ));
			
		var reader = new ChunkReader();
		
		reader.ReadChunk(this.files.log.raw, 200).then((ev) => {
			var isValid = ev.result.indexOf("Mensaje ") >= 0;
			
			if (isValid) d.Resolve(this);
			
			d.Reject(new Error(`CD++ Parser is not valid for the selected files.`));
		});
		
		return d.promise;
	}
	
	ParseTasks() {		
		var defs = [];
		
		if (this.files.val) defs.push(Sim.ReadFile(this.files.val, this.ParseValFile));
		if (this.files.pal) defs.push(Sim.ReadFile(this.files.pal, this.ParsePalFile));
		if (this.files.ma) defs.push(Sim.ReadFile(this.files.ma, this.ParseMaFile));
		
		defs.push(this.ParseLogFile());
		
		return defs;
	}
	
	GetPalette() {
		var palette = new Palette(this.files.pal.raw.name);
		
		Array.ForEach(this.files.pal.content, function(d) {
			palette.AddClass(d.start, d.end, d.color);
		});
		
		return palette;
	}
	
	GetMessages() {
		var messages = [];
		
		if (this.files.val) messages = messages.concat(this.files.val.content);
		
		return messages.concat(this.files.log.content);
	}
	
	GetSize() {
		if (!this.files.ma) return null;
		
		var dim = this.files.ma.content.dim;
		
		return { x:dim[0], y:dim[1], z:dim[2] }
	}
	
	ParseMaFile(f) {
		var raw = f.match(/dim\s*:\s*\((.+)\)/);
		var dim = raw[1].split(",")
		
		if (dim.length == 2) dim.push(1);
		
		return { dim : [+dim[1], +dim[0], +dim[2]] }
	}
	
	ParsePalFile(f) {	
		var data = [];
		
		// Type A: [rangeBegin;rangeEnd] R G B
		Array.ForEach(f.split(/\n/), function(line) { 
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
			
			data.push({ start:begin, end:end, color:[r, g, b] });
		});
		
		return data;
	}	
	
	ParseValFile(f) {				
		var x, y, z;
		var data = [];
		
		// Each line looks like this: (y,x,z)=value
		Array.ForEach(f.split(/\n/), function(line) {
			if (line.length < 4) return; // probably empty line
			
			var cI = line.indexOf('('); // coordinate start
			var cJ = line.indexOf(')'); // coordinate end
			var vI = line.indexOf('='); // value start
			
			if (cI == -1|| cJ == -1 || vI == -1) return; // invalid line
			
			// Parse value
			var v = parseFloat(line.substr(vI + 1));
			
			// 2D or 3D?
			var split = line.substring(cI + 1, cJ).split(',');
						
			y = parseInt(split[0], 10); // Y coord
			x = parseInt(split[1], 10); // X coord
			z = parseInt(split.length == 3 ? split[2] : 0, 10); // Z coord

			data.push(new Message("00:00:00:000", [0,0,0,0], { x:x++, y:y++, z:z++ }, v)); 
		});
		
		return data;
	}
	
	ParseLogFile() {
		this.files.log.content = [];
		
		var d = Lang.Defer();
		var reader = new ChunkReader();
		
		this.ParseChunks(reader, this.files.log, d);
		
		return d.promise;
	}
	
	ParseChunks(reader, log, defer) {
		reader.ReadChunk(log.raw).then((ev) => {
			var idx = ev.result.lastIndexOf('\n');
			var chunk = ev.result.substr(0, idx);
			var messages = this.ParseSafeChunk(chunk);
			
			log.content = log.content.concat(messages);

			reader.MoveCursor(chunk.length + 1);
			
			this.Emit("Progress", { progress: 100 * reader.position / log.raw.size });
			
			if (reader.position < log.raw.size) this.ParseChunks(reader, log, defer);
			
			else if (reader.position == log.raw.size) defer.Resolve(log.content);
			
			else throw new Error("Reader position exceeded the file size.");
		});
	}
		
	ParseSafeChunk(chunk) {
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
			
			// Parse coordinates
			var i = split[2].indexOf('(');
			var j = split[2].indexOf(')');
			var c = split[2].substring(i + 1, j).split(',');
			
			// TODO : Does this ever happen?
			if (c.length < 2) return;

			var coord = { x:parseInt(c[1],10), y:parseInt(c[0],10), z:parseInt(c.length==3 ? c[2] : 0, 10) }
			
			// Parse state value
			var v = parseFloat(split[4]);
			
			// Parse Timestamp
			var idx = split[1].trim();
			
			var time = Array.Map(idx.split(":"), function(t) { return +t; });
			
			safe.push(new Message(idx, time, coord, v));
		});

		return safe;
	}
}