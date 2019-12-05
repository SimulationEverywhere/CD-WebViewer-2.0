'use strict';

import Lang from '../utils/lang.js';
import Array from '../utils/array.js';

export default class Recorder { 
	
	constructor(canvas) {		
		this.canvas = canvas;
		this.chunks = null;
		
		var options = { mimeType: 'video/webm;codecs=vp9' };
		
		this.recorder = new MediaRecorder(canvas.captureStream(), options); // init the recorder
		
		// every time the recorder has new data, we will store it in our array
		this.recorder.ondataavailable = (function(ev) {
			this.chunks.push(ev.data);
		}).bind(this);
	}	
	
	Start() {	
		this.chunks = [];
		
		this.recorder.start();
	}
	
	Stop() {
		var d = Lang.Defer();
		
		this.recorder.onstop = e => d.Resolve();
		
		this.recorder.stop();
		
		return d.promise;
	}
	
	Download(name) {
		// TODO : check if can use net.Download
		if (this.chunks.length == 0) return;
		
		var blob = new Blob(this.chunks, { type: 'video/webm' });
		var url = URL.createObjectURL(blob);
		var a = document.createElement('a');
		
		document.body.appendChild(a);
		
		a.style = 'display: none';
		a.href = url;
		a.download = name + '.webm';
		a.click();
		
		window.URL.revokeObjectURL(url);
	}
}