'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Dom from '../../utils/dom.js';
import Widget from '../../ui/widget.js';

export default Lang.Templatable("Diagram.DevsDiagram", class DevsDiagram extends Widget { 

	constructor() {
		super();
	}
	
	SetSVG(svg) {
		this.Node('diagram').innerHTML = svg;
<<<<<<< HEAD
		this.Node("diagram").getElementsByTagName("svg")[0].setAttribute("width", "100%");
		this.Node("diagram").getElementsByTagName("svg")[0].setAttribute("height", "100%");
		this.Node("diagram").getElementsByTagName("svg")[0].setAttribute("viewbox", "0 0 560 340"); // as per the cell dimesions 			this.Node("diagram").getElementsByTagName("svg")[0].setAttribute("preserveAspectRatio", "none");

		var models = this.Node('diagram').querySelectorAll("[model]");

=======

		var models = this.Node('diagram').querySelectorAll("[model]");
>>>>>>> 612d2ef03beb4fcddcc68a080b8c6d671ee12a51
		
		this.models = {};
		
		Array.ForEach(models, function(model) {
			var id = model.getAttribute("model");
			
			model.addEventListener("mousemove", this.onSvgMouseMove_Handler.bind(this));
			model.addEventListener("click", this.onSvgClick_Handler.bind(this));
			model.addEventListener("mouseout", this.onSvgMouseOut_Handler.bind(this));
			
			this.models[id] = {
				svg : model,
				fill : model.getAttribute("fill"),
				stroke : model.getAttribute("stroke"),
				width : model.getAttribute("stroke-width")
			}
		}.bind(this));
	}
	
	onSvgMouseMove_Handler(ev) {
		var model = ev.target.getAttribute('model');
	
		this.Emit("MouseMove", { x:ev.pageX, y:ev.pageY , model:model });
	}
		
	onSvgMouseOut_Handler(ev) {
		this.Emit("MouseOut", { x:ev.pageX, y:ev.pageY });
	}
	
	onSvgClick_Handler(ev) {
		var model = ev.target.getAttribute('model');
		
		this.Emit("Click", { x:ev.pageX, y:ev.pageY , model:this.models[model] });
	}
		
	DrawModel(model, fill, stroke, width) {
		if (fill) model.svg.setAttribute('fill', fill);
		if (stroke) model.svg.setAttribute('stroke', stroke);
		if (width) model.svg.setAttribute('stroke-width', width);
	}
	
	ResetModel(model) {
		model.svg.setAttribute('fill', model['fill']);
		model.svg.setAttribute('stroke', model['stroke']);
		model.svg.setAttribute('stroke-width', model['stroke-width']);
	}
	
	Template() {
		return "<div class='devs-diagram'>" + 
		 	      "<div handle='title' class='devs-diagram-title'>nls(DevsDiagram_Title)</div>" + 
				  "<div handle='diagram-container' class='devs-diagram-container'>" +
					"<div handle='diagram' ></div>" +
				  "</div>" + 
			   "</div>";
	}

	Resize() {
		this.size = Dom.Geometry(this.Node("diagram-container"));
		
		var pH = 30;
		var pV = 30;
		
		this.Node("diagram").style.margin = `${pV}px ${pH}px`;
		this.Node("diagram").style.width = `${(this.size.w - (30))}px`;	
		this.Node("diagram").style.height = `${(this.size.h - (30))}px`;
	}
	
	Draw(state) {

	}

	DrawChanges(state) {
		for (var id in this.models) this.ResetModel(this.models[id]);
		
		//TO DRAW INITIAL STATE AFTER SHOWING THE CHANGES.
		var transitions = this.data.transitions[state.i];
		
		Array.ForEach(transitions, function(t) {
			var m = this.models[t.id];
			
			if (!m) return;
		
			// TODO : style should come from auto wrapper.
			this.DrawModel(m, 'LightSeaGreen', null, 3.0);
		}.bind(this));
	}

	Data(data) {
		this.data = data;
	}
});