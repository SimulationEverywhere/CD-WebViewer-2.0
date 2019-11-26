'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Dom from '../../utils/dom.js';
import Diagram from './diagram.js';
import Automated from '../automated.js';

import Tooltip from '../../ui/tooltip.js';

export default Lang.Templatable("Auto.DevsDiagram", class AutoDevsDiagram extends Automated { 

	constructor(config, simulation) {
		super(new Diagram(), simulation);
		
		this.Widget.SetSVG(config.svg);
		
		this.svg = config.svg;
		this.selected = [];

		var h1 = this.Widget.On("MouseMove", this.onMouseMove_Handler.bind(this));
		var h2 = this.Widget.On("MouseOut", this.onMouseOut_Handler.bind(this));
		var h3 = this.Widget.On("Click", this.onClick_Handler.bind(this));
		var h4 = this.Simulation.On("Move", this.onSimulationMove_Handler.bind(this));
		var h5 = this.Simulation.On("Jump", this.onSimulationMove_Handler.bind(this));
		var h6 = this.Simulation.Selection.On("Change", this.onSelectionChange_Handler.bind(this));
		
		this.Handle([h1, h2, h3, h4, h5,h6]);
		
		this.UpdateSelected();
		this.Data();
		this.BuildTooltip();
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
	}

	Resize() {
		this.Widget.Resize();
	}
	
	Data() {
		var transitions = Array.Map(this.Simulation.frames, function(f) { return f.transitions; });
		
		var data = {
			transitions : transitions
		};
		
		this.Widget.Data(data);
	}

	onSimulationMove_Handler(ev) {	
		this.Widget.DrawChanges(this.Simulation.state);
	}
	
	onSelectionChange_Handler(ev) {
		this.Widget.DrawChanges(this.Simulation.state);
	}
	
	UpdateSelected() {
		this.selected = this.Simulation.Selection.Selected;
	}
	
	onMouseMove_Handler(ev) {
		var subs = [ev.model, this.Simulation.state.models[ev.model]];
		
		this.tooltip.nodes.label.innerHTML = Lang.Nls("Widget_DEVS_Tooltip_Title", subs);
	
		this.tooltip.Show(ev.x + 20, ev.y);
	}
	
	onClick_Handler(ev) {
		var idx = this.selected.indexOf(ev.model);
		
		// TODO : Selection should be handled by diagram, not auto class
		if (idx == -1) {
			this.selected.push(ev.model);
			this.Widget.DrawModel(ev.model, null, 'red', null);
		}
		else {
			this.selected.splice(idx, 1);
			this.Widget.ResetModel(ev.model);
		}
		
		Array.ForEach(this.selected, function(s) {
			this.Widget.DrawModel(s, null, 'red', null);
		}.bind(this));
	}

	onMouseOut_Handler(ev) {
		this.tooltip.Hide();
	}
	
	Save() {
		return { name:"Auto.DevsDiagram", config:{ svg:this.svg }}
	}
});