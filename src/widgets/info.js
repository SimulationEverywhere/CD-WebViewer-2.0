'use strict';

import Lang from '../utils/lang.js';
import Dom from '../utils/dom.js';
import Widget from '../ui/widget.js';

export default Lang.Templatable("Widget.Info", class Info extends Widget { 

	constructor(id) {
		super(id);
	}
	
	Template() {
		return	"<div class='info-title'>nls(Info_Title)</div>" +
				"<div handle='noFiles' class='info-noFiles'>nls(Info_NoFiles)</div>" +
				"<div handle='content' class='hidden'>" +
					"<div class='info-line'>" +
						"<span class='info-label'>nls(Info_Label_Simulator)</span>" +
						"<span class='info-value' handle='simulator'></span>" +
					"</div>" +
					"<div class='info-line'>" +
						"<span class='info-label'>nls(Info_Label_Files)</span>" +
						"<span class='info-value' handle='files'></span>" +
					"</div>" +
					"<div class='info-line'>" +
						"<span class='info-label'>nls(Info_Label_Name)</span>" +
						"<span class='info-value' handle='name'></span>" +
					"</div>" +
					"<div class='info-line'>" +
						"<span class='info-label'>nls(Info_Label_Dimensions)</span>" +
						"<span class='info-value' handle='dimensions'></span>" +
					"</div>" + 
					"<div class='info-line'>" +
						"<span class='info-label'>nls(Info_Label_NumberFrames)</span>" +
						"<span class='info-value' handle='nFrames'></span>" +
					"</div>" + 
					"<div class='info-line'>" +
						"<span class='info-label'>nls(Info_Label_LastFrame)</span>" +
						"<span class='info-value' handle='lastFrame'></span>" +
					"</div>" + 
				"</div>";
	}
	
	Clear() {
		this.Node("simulator").innerHTML = "";
		this.Node("name").innerHTML = "";
		this.Node("files").innerHTML = "";
		this.Node("dimensions").innerHTML = "";
		this.Node("nFrames").innerHTML = "";
		this.Node("lastFrame").innerHTML = "";
		
		Dom.ToggleCss(this.Node("content"), "hidden", true);
		Dom.ToggleCss(this.Node("noFiles"), "hidden", false);
	}
	
	Initialize(simulation) {
		Dom.ToggleCss(this.Node("noFiles"), "hidden", true);
		Dom.ToggleCss(this.Node("content"), "hidden", false);
		
		this.UpdateLine("simulator", simulation.simulator);
		this.UpdateLine("files", this.FilesAsString(simulation));
		this.UpdateLine("name", simulation.name);
		this.UpdateLine("dimensions", this.SizeAsString(simulation));
		this.UpdateLine("nFrames", simulation.nFrames);
		this.UpdateLine("lastFrame", simulation.lastFrame);
	}
	
	UpdateLine(id, value) {
		if (!value) Dom.ToggleCss(this.Node(id).parentNode, "hidden", true);
		
		else {
			Dom.ToggleCss(this.Node(id).parentNode, "hidden", false);
			
			this.Node(id).innerHTML = value;
		}
	}
	
	SizeAsString(simulation) {
		if (!simulation.size) return null;
	
		return `${simulation.size.x}, ${simulation.size.y}, ${simulation.size.z}`;
	}
	
	FilesAsString(simulation) {		
		return simulation.files.map(f => f.name).join(", ");
	}
	
	
});