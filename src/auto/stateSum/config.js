'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Dom from '../../utils/dom.js';
import Widget from '../../ui/widget.js';

export default Lang.Templatable("Config.StateSum", class ConfigCellTrack extends Widget { 

	constructor(simulation) {
		super();
		
		this.Node("continue").addEventListener("click", this.onLoadClick_Handler.bind(this));
		
		var name = Lang.Nls("StateChart_Title");
		
		this.Node("title").innerHTML = Lang.Nls("Configurator_Title", [name]);
		
		var value = Array.Map(simulation.palette.classes, function(c) {
			return {
				value : null,
				min : c.start,
				max : c.end
			}		
		});
		
		this.Node("tracked").value = JSON.stringify(value);
	}
		
	onLoadClick_Handler(ev) {		
		var configuration = {
			z : [+this.Node("z").value],
			tracked : JSON.parse(this.Node("tracked").value)
		}
		
		this.Emit("Configured", { configuration:configuration });
	}
	
	Save() {
		return { name:"Config.StateSum" };
	}
	
	Template() {
		return "<div class='configuration'>" + 
				   "<div handle='title' class='configuration-title'></div>" + 
				   "<div class='configuration-line'>" + 
					  "<div class='label'>nls(StateChart_Title)</div>" +
					  "<input handle='z' class='value' type='number' value='0'></input>" +
				   "</div>" +
				   "<div class='configuration-line'>" + 
					  "<div class='label'>nls(CellTrackConfig_Tracked)</div>" +
					  "<textarea handle='tracked' class='value' type='text' value='100;101;102'></textarea>" +
				   "</div>" +
				   "<button handle='continue' class='load'>nls(Configurator_Continue)</button>" + 
			   "</div>";
	}
});