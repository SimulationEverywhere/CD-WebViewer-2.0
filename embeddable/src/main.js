'use strict';

import nls from '/DEV/CD-WebViewer-2.0/src/nls.js';
import Lang from '/DEV/CD-WebViewer-2.0/src/utils/lang.js';
import Net from '/DEV/CD-WebViewer-2.0/src/utils/net.js';
import Sim from '/DEV/CD-WebViewer-2.0/src/utils/sim.js';
import Array from '/DEV/CD-WebViewer-2.0/src/utils/array.js';
import Dom from '/DEV/CD-WebViewer-2.0/src/utils/dom.js';
import Widget from '/DEV/CD-WebViewer-2.0/src/ui/widget.js';
import Playback from '/DEV/CD-WebViewer-2.0/src/widgets/playback.js';
import AutoGrid from '/DEV/CD-WebViewer-2.0/src/auto/gridLayer/auto.js';
import Settings from '/DEV/CD-WebViewer-2.0/src/simulation/settings.js';

export default class Main extends Widget { 

	constructor(node) {
		Lang.locale = "en";
		Lang.nls = nls;
		
		zip.workerScriptsPath = "/DEV/CD-WebViewer-2.0/references/zip/"
		
		super(node);
		
		this.settings = new Settings();
		
		this.settings.FPS = 30;
		this.settings.Loop = true;
		
		// sample url
		// http://localhost/Dev/cd-webviewer-embeddable/index.html?config={"type":"dev", "model":"life"}
		var json = Net.GetUrlParameter("config");
		var config = JSON.parse(json);
		// var url = `http://vs1.sce.carleton.ca:8080/cdpp/sim/workspaces/test/dcdpp/${config.model}/results.zip`;
		var url = `https://simulationeverywhere.github.io/CD-WebViewer-2.0/embeddable/results.zip`;

		var p = Net.Request(url, null, 'blob')
		
		p.then(this.onRequestSuccess_Handler.bind(this), this.onFailure_Handler.bind(this));
	}
	
	onRequestSuccess_Handler(ev) {
		var p = Sim.ReadZipRISE(ev.result, 1);
		
		p.then(this.onReadZipSuccess_Handler.bind(this), this.onFailure_Handler.bind(this));
	}
	
	onReadZipSuccess_Handler(ev) { 
		var p = Sim.DetectParser([ev.result]);
		
		p.then(this.onParserDetected_Handler.bind(this), this.onFailure_Handler.bind(this));		
	}
	
	onParserDetected_Handler(ev) {
		var parser = ev.result;
		var p = parser.Parse(parser.files, this.settings)
		
		p.then(this.onParsed_Handler.bind(this));
	}
	
	onParsed_Handler(ev) {
		this.simulation = ev.result;
		this.simulation.Palette.AddClass(0, 1, [0,0,0]);
		this.simulation.Palette.AddClass(1, 11, [100,0,0]);
		this.simulation.Palette.AddClass(11, 21, [0,100,0]);
		this.simulation.Palette.AddClass(21, 101, [0,0,100]);
		
		
		this.simulation.On("Error", this.onFailure_Handler.bind(this));
		
		this.Node("playback").Initialize(this.simulation, this.settings);
		
		var config = { z:0 };
		var grid = new AutoGrid(config, this.simulation);
		
		grid.Place(this.Node("container"));
		grid.Refresh();
	}
	
	onFailure_Handler(error) {
		debugger;
		var x = error;
	}
	
	Template() {
		return	"<div class='main'>" +
					"<div handle='container' style='height:300px;'></div>" + 
					"<div handle='playback' class='playback' widget='Widget.Playback'></div>" +
				"</div>";
	}
}