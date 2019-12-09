'use strict';

import Lang from '../utils/lang.js';
import Widget from '../ui/widget.js';
import Array from '../utils/array.js';
import Dom from '../utils/dom.js';
import Net from '../utils/net.js';
import Tooltip from '../ui/tooltip.js';

export default Lang.Templatable("Widget.RiseList", class RiseList extends Widget {

    constructor(id) {
        super(id);
		
		// TODO : Not sure this should go here
		zip.workerScriptsPath = "./references/zip/";
		
		// TODO : This is temporary, just to showcase how we could read from RISE. We need
		// to fix a bunch of issues with RISE before we can fully implement this.

		this.models = [
			{
				"name": "Addiction Model",
				"url": "http://localhost/Dev/CD-WebViewer-2.0/log/Addiction/Addiction.zip",
				"handle" : "Addiction-model"
			}, {
				"name": "CO2 Model",
				"url": "http://localhost/Dev/CD-WebViewer-2.0/log/CO2/CO2.zip",
				"handle" : "CO2-model"
			}, {
				"name": "Fire Model",
				"url": "http://localhost/Dev/CD-WebViewer-2.0/log/Fire/Fire.zip",
				"handle" : "Fire-model"
			}, {
				"name": "Fire And Rain Model",
				"url": "http://localhost/Dev/CD-WebViewer-2.0/log/Fire And Rain/FireAndRain.zip",
				"handle" : "Rain-model"
			}, {
				"name": "Life Model",
				"url": "http://localhost/Dev/CD-WebViewer-2.0/log/Life/2/2.zip",
				"handle" : "Life-model"
			}, {
				"name": "Logistic Urban Growth Model",
				"url": "http://localhost/Dev/CD-WebViewer-2.0/log/Logistic Urban Growth/4/4.zip",
				"handle" : "LogisticUrban-model"
			}, {
				"name": "Swarm Model",
				"url": "http://localhost/Dev/CD-WebViewer-2.0/log/Swarm/Swarm.zip",
				"handle" : "Swarm-model"
			}, {
				"name": "Tumor Model",
				"url": "http://localhost/Dev/CD-WebViewer-2.0/log/Tumor/Tumor.zip",
				"handle" : "Tumor-model"
			}, {
				"name": "UAV Model",
				"url": "http://localhost/Dev/CD-WebViewer-2.0/log/UAV/UAV.zip",
				"handle" : "UAV-model"
			}, {
				"name": "Worm Model",
				"url": "http://localhost/Dev/CD-WebViewer-2.0/log/Worm/Worm.zip",
				"handle" : "Worm-model"
			}
		]
		
		Array.ForEach(this.models, function(m) {
			this.AddModel(m);
		}.bind(this));
		this.BuildTooltip();
    }

	BuildTooltip() {
		this.tooltip = new Tooltip(document.body);
		
		this.tooltip.nodes.label = Dom.Create("div", { className:"tooltip-label" }, this.tooltip.Node("content"));
	}

	AddModel(model) {
		var li = Dom.Create("li", { className:'model' }, this.Node('list'));
		li.setAttribute("handle", "li");
		var button = document.createElement("button");// "<button ><a handle='tooltip' data-toggle='tooltip' >?</a></button>"
		li.innerHTML = model.name;
		li.appendChild(button);
		button.innerHTML='?';
		button.setAttribute("handle", model.handle);
		li.addEventListener("click", this.onLiModelClick_Handler.bind(this, model));
		button.addEventListener("mousemove", this.onTooltipOver_Handler.bind(this, model));
		button.addEventListener("mouseout", this.onTooltipOut_Handler.bind(this, model));
		
	}

	onTooltipOver_Handler(model, ev){
		var subs = model.handle;
		
		this.tooltip.nodes.label.innerHTML = Lang.Nls(model.handle, subs);
	
		this.tooltip.Show(ev.x + 20, ev.y);
	}

	onTooltipOut_Handler(model, ev){
			this.tooltip.Hide();
	}

    onLiModelClick_Handler(model, ev){
        this.getRiseModel(model);
    }

    getRiseModel(model){
		var p = Net.Request(model.url, null, 'blob');

		var success = function(ev) { 
			var blob = new Blob([ev.result], { type : "application/zip" });
			var r = new zip.BlobReader(blob);

			zip.createReader(r, this.ReadZip.bind(this), this.onError_Handler);
		}.bind(this);

		p.then(success, this.onError_Handler);
    }

	ReadEntry(entry) {
		var d = Lang.Defer();
		
		entry.getData(new zip.TextWriter(), function(text) {
			var blob = new Blob([text], { type: "text/plain" });
			var file = new File([blob], entry.filename);

			d.Resolve(file);
		});
				
		return d.promise;
	}

	ReadZip(reader) {
		reader.getEntries(function(entries) {
			var defs = Array.Map(entries, function(e) { return this.ReadEntry(e); }.bind(this));   
			
			Promise.all(defs).then(function(data) {
				reader.close();
				
				var files = Array.Map(data, function(ev) { return ev.result; });
				
				this.Emit("FilesReady", { files : files });
			}.bind(this));
		}.bind(this));
	}

	onError_Handler(error) {
		alert(error.toString());
	}

    Template(){
        return "<ul handle='list'></ul>" ;
    }
});