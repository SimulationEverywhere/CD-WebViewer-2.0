'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Dom from '../../utils/dom.js';
import Widget from '../../ui/widget.js';

export default Lang.Templatable("Diagram.DevsDiagram", class DevsDiagram extends Widget { 

	constructor(file) {
		super();
		this.dimensions = null;
		this.fill = null;
		this.svgcontent="";
		this.svgcontent=file;

		this.Node("diagram").addEventListener("click", this.onsvgClick_Handler.bind(this));
	
		this.Node("diagram").addEventListener("mousemove", this.onsvgMouseMove_Handler.bind(this));
		this.Node("diagram").addEventListener("mouseout", this.onsvgMouseOut_Handler.bind(this));

	}
	onsvgMouseMove_Handler(ev)
	{
		this.data2="";
		this.data2= ev.target.id;
	
		this.Emit("MouseMove", {x:ev.pageX, y:ev.pageY , data2:this.data2});
	}
		
	onsvgMouseOut_Handler(ev) {		
		this.Emit("MouseOut", { x:ev.pageX, y:ev.pageY });
	}
	
	onsvgClick_Handler(ev) {

		this.selectedid="";
		this.selectedid= ev.target.id;
		
		this.Emit("Click", {x:ev.pageX, y:ev.pageY , selectedid:this.selectedid});
	

	}
	Update(state,selection) {
		this.DrawChanges(state,selection);
	}

	DrawSVGBorder(selection,color) {
	
	
	var selected_id = selection.selected;
	//console.log(selected_id);
	for (var i = 0; i < selected_id.length; i++) {
		if(document.getElementById(selected_id[i])!=null)
			{	
   	document.getElementById(selected_id[i]).style.stroke = color;
   	document.getElementById(selected_id[i]).style['stroke-width']=2.0;
   }
	}
		
	}

	Template() {

			   		return "<div class='grid'>" + 
				  "<div handle='title' class='grid-title'>nls(DevsDiagram_Title)</div>" + 
				  "<div handle='diagram-container' class='grid-canvas-container'>" +
					"<div handle='diagram' ></div>" +
					"<div handle='diagram_hidden' hidden></div>" +
				  "</div>" + 
			   "</div>";
	}

	Resize() {


		this.size = Dom.Geometry(this.Node("diagram-container"));
		var pH = 30 ;
		var pV = 30;
		this.Node("diagram").style.margin = `${pV}px ${pH}px`;
		this.Node("diagram").style.width =   `${(this.size.w - (30))}px`;	
		this.Node("diagram").style.height =  `${(this.size.h - (30))}px`  ;
			
	
	}
	
	Draw(state,selection) {
		
			this.DrawState(state,selection);
	
	//	else this.Default(DEFAULT_COLOR);
	}

	DrawState(state,selection)
	{		this.Node('diagram_hidden').innerHTML = this.svgcontent;
			this.Node("diagram_hidden").getElementsByTagName("svg")[0].setAttribute("width", "100%");
			this.Node("diagram_hidden").getElementsByTagName("svg")[0].setAttribute("height", "100%");
			this.Node("diagram_hidden").getElementsByTagName("svg")[0].setAttribute("viewbox", "0 0 560 340"); // as per the cell dimesions 
			this.Node("diagram_hidden").getElementsByTagName("svg")[0].setAttribute("preserveAspectRatio", "none");
			this.Node("diagram_hidden").getElementsByTagName("title").hidden = true;
			
			this.Node('diagram').innerHTML =this.Node('diagram_hidden').innerHTML;
			this.DrawSVGBorder(selection,'red');
	}
	DrawChanges(state,selection)
	{	
			//console.log(selection.selected);
			var transitions =this.data.transitions[state.i];
			//console.log(transitions);
			
			this.Reset(state);
			Array.ForEach(transitions, function(t) {
 	 		//console.log(state.model);
 	 		const fill = 'LightSeaGreen';
			var t_id =t.id;
			
			if(document.getElementById(t_id)!=null)
			{	
				document.getElementById(t_id).style.fill=fill;
			
			}
			
			}.bind(this));
			this.DrawSVGBorder(selection,'red');
		}
	Reset(state)
	{
		//console.log(Object.keys(state.model));
		var selected_id = Object.keys(state.model);
	//console.log(selected_id);
	for (var i = 0; i < selected_id.length; i++) {
		if(document.getElementById(selected_id[i])!=null)
			{	
   	document.getElementById(selected_id[i]).style.fill = 'white';
 //  	document.getElementById(selected_id[i]).style['stroke-width']=2.0;
   }
	}
	}

	Data(data) {
		this.data = data;
	}
	

});