'use strict';

import Lang from './lang.js';
import CDpp from '../simulation/parsers/CDpp.js';
import RISE from '../simulation/parsers/RISE.js';
import ChunkReader from '../components/chunkReader.js';

const PARSERS = [CDpp, RISE];

export default class Sim {
	
	static DetectParser(files) {		
		var d = Lang.Defer();
		var parsers = PARSERS.map(p => new p(files));
		var defs = parsers.map(p => p.IsValid());
		
		Promise.all(defs).then(function(results) {
			var valids = results.filter(r => r.result);
			
			if (valids.length > 1) d.Reject(new Error("Files match multiple parsers."));
			
			if (valids.length == 0) d.Reject(new Error("Could not detect the simulator used to generate the files."));
			
			var idx = results.findIndex(r => r.result);
			
			d.Resolve(parsers[idx]);
		})
		
		return d.promise;
	}
	
	static ParseFile(file, parser) {
		var d = Lang.Defer();
		var r = new ChunkReader();
		
		if (!file) d.Resolve(null);
		
		else r.Read(file.raw).then(function(ev) {
			var content = parser(ev.result);
			
			d.Resolve(content);
		});

		return d.promise;
	}
	
	static ParseFileByChunk(file, parser) {
		var d = Lang.Defer();
		var reader = new ChunkReader();
		
		if (!file) d.Resolve(null);
		
		ParseFileChunk();
		
		return d.promise;
		
		function ParseFileChunk() {
			reader.ReadChunk(file.raw).then((ev) => {
				var idx = ev.result.lastIndexOf('\n');
				var content = ev.result.substr(0, idx);
				
				reader.MoveCursor(content.length + 1);
				
				parser(content, 100 * reader.position / file.raw.size);
				
				if (reader.position < file.raw.size) ParseFileChunk();
				
				else if (reader.position == file.raw.size) d.Resolve(content);
				
				else throw new Error("Reader position exceeded the file size.");
			});
		}
	}
	
	static RgbToHex(rgb) {
		return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
	}
	
	static HexToRgb(hex) {
		var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		
		return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
	}
	
	static ReadZipRISE(content, idx) {
		var d = Lang.Defer();
		var blobZip = new Blob([content], { type : "application/zip" });
		
		zip.createReader(new zip.BlobReader(blobZip), function(reader) {
			reader.getEntries(function(entries) {
				entries[idx].getData(new zip.TextWriter(), function(text){
					var blobTxt = new Blob([text], { type: "text/plain" });

					var file = new File([blobTxt], entries[idx].filename);

					// reader.close(function(){  });
					reader.close();
					
					d.Resolve(file);
			   }/*,
			   function(current,total){
				   //progress callback
			   }*/);
		   });
		}, function(error){
			d.Reject(error);
		});
		
		return d.promise;
	}
}