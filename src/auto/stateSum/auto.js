'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Dom from '../../utils/dom.js';
import Tooltip from '../../ui/tooltip.js';
import StateChart from './chart.js';
import Automated from '../automated.js';

export default Lang.Templatable("Auto.StateChart", class AutoStateChart extends Automated { 

	constructor(config, simulation) {
		super(new StateChart(), simulation);
		
		this.z = config.z;
		this.tracked = config.tracked;
		
		this.data = this.BaseData(config.tracked, simulation.palette);
		
		this.yMax = simulation.size[0] * simulation.size[1];
		
		var h1 = this.Widget.On("MouseMove", this.onMouseMove_Handler.bind(this));
		var h2 = this.Widget.On("MouseOut", this.onMouseOut_Handler.bind(this));
		var h3 = this.Simulation.On("Move", this.onSimulationMove_Handler.bind(this));
		var h4 = this.Simulation.On("Jump", this.onSimulationMove_Handler.bind(this));
		var h5 = this.Simulation.palette.On("Change", this.onSimulationPaletteChange_Handler.bind(this));
		
		this.Handle([h1, h2, h3, h4, h5]);
		
		this.BuildTooltip();
		
		this.Data();
	}
	
	BaseData(tracked, palette) {
		return Array.Map(tracked, function(t) {
			var d = {
				min : t.min,
				max : t.max,
				value : t.value,
				total : 0
			}
			
			if (t.value != undefined && t.value != null) {
				d.color = palette.GetColor(d.value);
				d.label = t.value;
			}
			
			else {
				d.color = palette.GetColor((d.min + d.max) / 2);
				d.label = "between " + t.min + " and " + t.max;
			}
			
			return d;
		})
	}
	
	Destroy() {
		super.Destroy();
	}
	
	BuildTooltip() {
		this.tooltip = new Tooltip(document.body);
		
		this.tooltip.nodes.label = Dom.Create("div", { className:"tooltip-label" }, this.tooltip.Node("content"));
	}
	
	Refresh() {
		this.Resize();
		this.Draw();
		this.Update();
	}
	
	Resize() {
		this.Widget.Resize();		
	}
	
	Draw() {
		this.Widget.Draw(this.yMax);
	}
	
	Update() {
		this.Widget.Update();
	}
	
	Data() {		
		var state = this.Simulation.state;
		
		Array.Map(this.data, function(d) {
			d.total = 0;
			
			for(var id in state.models){
				var value = state.models[id];
												
				if (d.value == value) d.total++;
				
				else if (d.min < value && d.max >= value) d.total++;
			}

		}.bind(this));
		
		this.Widget.Data(this.data);
	}
	
	// TODO: This can be made more efficient by applying only the transitions
	onSimulationMove_Handler(ev) {
		this.Data();
		this.Update();
	}
	
	onSimulationPaletteChange_Handler(ev) {
		this.data = this.BaseData(this.tracked, this.Simulation.palette);
		
		this.Data();
		this.Draw(this.yMax);
	}
	
	onMouseMove_Handler(ev) {
		var subs = [this.Simulation.state.i, ev.data.total, ev.data.label];
		
		this.tooltip.nodes.label.innerHTML = Lang.Nls("StateChart_Tooltip_Title", subs);
	
		this.tooltip.Show(ev.x + 20, ev.y);
	}
	
	onMouseOut_Handler(ev) {
		this.tooltip.Hide();
	}
	
	Save() {
		return { name:"Auto.StateChart", config: { z:this.z, tracked:this.tracked }}
	}
});
