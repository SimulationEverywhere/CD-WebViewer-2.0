'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Sim from '../../utils/sim.js';
import Frame from '../frame.js';
import Transition from '../transition.js';
import Parser from "./parser.js";
import Palette from '../palette.js';
import ChunkReader from '../../components/chunkReader.js';

export default class DEVS extends Parser { 
		
	constructor(fileList) {
		super(fileList);
		this.frames = [];
	}
		
	IsValid() {		
		var d = Lang.Defer();

		if (!this.files.log) d.Reject(new Error(`DEVS Parser is not valid for the selected files.` ));

		var reader = new ChunkReader();
		
		reader.ReadChunk(this.files.log.raw, 400).then((ev) => {

			var isValid = ev.result.indexOf(",") >= 0;
			
			if (!isValid) d.Resolve(this);
			
			d.Reject(new Error(`DEVS Parser is not valid for the selected files.`));
		});
		
		return d.promise;
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
			this.ParseSafeChunk(chunk);
			
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
			
			// Parse model id
			var i = split[2].indexOf('(');
			var j = split[2].indexOf(')');
			var c = split[2].substring(i + 1, j).split(',');
			
			if (c.length > 1) return;
			
			// Parse model id, state value, timestamp used as frame id
			var id = c[0] ;
			var v = parseFloat(split[4]);
			var fId = split[1].trim();
						
			var f = simulation.Index(fId) || simulation.AddFrame(new Frame(fId));

			frame.AddTransition(new Transition(id, v));
	
			this.models[model] = model;
		}.bind(this));
	}
}