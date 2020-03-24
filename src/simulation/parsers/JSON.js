'use strict';

import Lang from '../../utils/lang.js';
import Net from '../../utils/net.js';
import Array from '../../utils/array.js';
import Sim from '../../utils/sim.js';
import Simulation from '../simulation.js';
import Palette from '../palettes/basic.js';
import Frame from '../frame.js';
import TransitionCA from '../transitionCA.js';
import TransitionCSV from '../transitionCSV.js';
import Parser from "./parser.js";
import ChunkReader from '../../components/chunkReader.js';

export default class JSON extends Parser { 
		
	constructor(fileList) {
		super(fileList); 
		this.frames = [];
		this.models =[];
		this.simulationX = new Simulation();
		this.colorarray =[];
		this.rangearray =[];
	}
		
	IsValid() {		
		var d = Lang.Defer();
		var json = Array.Find(this.files, function(f) { return f.name.match(/.json/i); });
		
		if (!json ) d.Resolve(false);
		
   		var reader = new ChunkReader();

		reader.ReadChunk(json, 400).then((ev) => {
			var type = ev.result.match(/type\s*:\s*(.+)/);
			
			d.Resolve(type == null);
		});
  		
		return d.promise;
	}
	
	Parse(files, settings) {
		var d = Lang.Defer();
		var simulation = new Simulation();
		
		this.files = files;
		this.settings = settings;		
		var json = Array.Find(files, function(f) { return f.name.match(/.json/i); });
		
		var p1 = Sim.ParseFile(json, this.ParseJSONFile.bind(this, simulation));


		var defs = [p1];
		
		var defsdata = Promise.all(defs).then((data) => {
			return (data[0].result);
		});	
		
			
	defsdata.then(function(result) {
 		d.Resolve(result);
		});
	
		return d.promise;
	}



	ParseJSONFile(simulation, chunk, progress) 
	{	

		var svgstart = chunk.indexOf('svg',0);
		var svgend =  chunk.indexOf(',', svgstart);
		var logstart = chunk.indexOf('log',0);
		var logend =  chunk.indexOf('}', svgstart);
		
		var svgUrl = chunk.substr(svgstart, svgend - svgstart).split('":')[1];
		var logurl = chunk.substr(logstart, logend - logstart).split(':"')[1].replace('"','');

		var simulatorstart = chunk.indexOf('simulator',0);
		var simulatorend =  chunk.indexOf(',', simulatorstart);

		var namestart = chunk.indexOf('name',0);
		var nameend =  chunk.indexOf(',', namestart);

		var sizestart = chunk.indexOf('size',0);
		var sizeend =  chunk.indexOf('}', sizestart);

		this.simulatorName = chunk.substr(namestart, nameend - namestart).split(':"')[1].replace('"','');
		this.simulator = chunk.substr(simulatorstart, simulatorend - simulatorstart).split(':"')[1].replace('"','');


		simulation.size = (chunk.substr(sizestart, sizeend - sizestart).split(':')[1].trim().replace('[','').replace(']','').split(',')).map(Number);

		this.ParsePalette(chunk, simulation);

		var p1 = svgUrl ? Net.FetchSVG(svgUrl.replace('"','').replace('"','')) : null;
		var p2 = Net.FetchLog(logurl);
		
		
		var c = Promise.all([p1,p2]).then((data) => {
			simulation.svg = data[0];
			var x = this.ParseCSVFile(data[1], simulation);
			return x;
		});	
		
		return c;

		}
	
	ParseCSVFile( transitionCsv, simulation) {		
		this.transition = transitionCsv;

		var lines= [];

		lines = (transitionCsv.split("\n"));

		var i =1;
		Array.ForEach(lines, function(line) { 
			var split = line.split(",");

			// Parse model id
			var model = split[1];		
			var state = split[2];
			var input = split[3];
			var output = split[4];
			var phase = split[5];
			var coord = split[7];
			
	
			//Parse state value, timestamp used as frame id
			var v = parseFloat(split[4]);
			var fId = split[0];
						
			var f = simulation.Index(fId) || simulation.AddFrame(new Frame(fId));
			//f.AddTransition(new Transition(state, v));
			f.AddTransition(new TransitionCSV(fId, model, state,input, output,phase,coord));
		
		if(this.simulator == 'DEVS' || this.simulator == 'FSM')
			{	
					var modelsArray = []; 

					modelsArray.push(model);
					var j = 0,k=0;
			        var count = 0; 
			        var start = false; 
			          
			        for (j = 0; j < modelsArray.length; j++) { 
			            for (k = 0; k < this.models.length; k++) { 
			                if ( modelsArray[j] == this.models[k] ) { 
			                    start = true; 
			                } 
			            } 
			            count++; 
			            if (count == 1 && start == false) { 
			                this.models.push(modelsArray[j]); 
			            } 
			            start = false; 
			            count = 0; 
			        } 
			        simulation.models = this.models;
			}

		}.bind(this));

		if(this.simulator == 'CDpp')
					for(var x = 0; x <simulation.size[0] ;x++)
					{ 	for(var y=0 ; y< simulation.size[1] ; y++)
						simulation.models.push(TransitionCSV.CoordToId([x,y,0]));
					}

				var info = {
						simulator : this.simulator,
						name : this.simulatorName,
						files : this.files,
						lastFrame : simulation.LastFrame().time,
						nFrames : simulation.frames.length
					}
					
				
					simulation.Initialize(info, this.settings);
					const returnedTarget = Object.assign(this.simulationX, simulation);
		return returnedTarget;
		}



ParsePalette(chunk, simulation)	
	{
		simulation.palette = new Palette();

		var colorstart = chunk.indexOf('color', 0);
			while (colorstart > -1 && colorstart < chunk.length) {
				var colorend = chunk.indexOf('}', colorstart);

				if (colorstart == -1) colorend = chunk.length + 1;

				var lengthX = colorend - colorstart;

				//linesX.push(chunk.substr(colorstart, lengthX));
			this.colorarray.push(chunk.substr(colorstart, lengthX).split(':')[1].replace('[','').replace(']','').trim());
				var colorstart = chunk.indexOf('color', colorstart + lengthX);
			}
			var rangestart = chunk.indexOf('range', 0);
			while (rangestart > -1 && rangestart < chunk.length) {
				var rangeend = chunk.indexOf('],', rangestart);

				if (rangestart == -1) rangeend = chunk.length + 1;

				var lengthX = rangeend - rangestart;

				//linesX.push(chunk.substr(colorstart, lengthX));
			this.rangearray.push(chunk.substr(rangestart, lengthX).split(':')[1].replace('[',''));
				var rangestart = chunk.indexOf('range', rangestart + lengthX);
			}

			for(var i=0; i< this.colorarray.length ; i++)
			{
				simulation.palette.AddClass(parseInt(this.rangearray[i].split(',')[0]), 
											parseInt(this.rangearray[i].split(',')[1]), 
											this.colorarray[i].split(',').map(Number));
			}

	}
}