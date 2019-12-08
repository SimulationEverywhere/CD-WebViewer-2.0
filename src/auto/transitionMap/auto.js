'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Dom from '../../utils/dom.js';
import Tooltip from '../../ui/tooltip.js';
import Grid from '../gridLayer/grid.js';
import Automated from '../automated.js';
import State from '../../simulation/state.js';
import Frame from '../../simulation/frame.js';
import TransitionCA from '../../simulation/TransitionCA.js';
import Palette from '../../simulation/palettes/gradient.js';

export default Lang.Templatable("Auto.TransitionMap", class AutoTransitionMap extends Automated { 

	constructor(config, simulation) {
		super(new Grid(), simulation);
		
		this.z = config.z;
		this.min = config.min;
		this.max = config.max;
		this.n = config.n;
		
		var h1 = this.Widget.On("MouseMove", this.onMouseMove_Handler.bind(this));
		var h2 = this.Widget.On("MouseOut", this.onMouseOut_Handler.bind(this));
		var h3 = this.Simulation.On("Move", this.onSimulationMove_Handler.bind(this));
		var h4 = this.Simulation.On("Jump", this.onSimulationJump_Handler.bind(this));
		
		this.Handle([h1, h2, h3, h4]);
		
		this.BuildTooltip();
		
		this.palette = new Palette();
		this.state = this.GetState(simulation, simulation.state.i);
		
		var max = this.GetMaxTransitions(simulation);
		
		var classes = this.palette.Buckets(this.n, this.min, this.max, 0, max);
		
		this.Widget.Node("title").innerHTML = Lang.Nls("TransitionMap_Title", [this.z + 1]);
	}
	
	GetState(simulation, i) {
		var state = State.Zero(simulation.models);
		
		for (var j = 0; j <= i; j++) {
			Array.ForEach(simulation.frames[j].transitions, function(t) {
				state.models[t.id]++;				
			});
		}
		
		return state;
	}
	
	GetMaxTransitions(simulation) {
		var state = this.GetState(simulation, simulation.frames.length - 1);
		var max = 0;
		
		for(var id in state.models){
			var v = state.models[id];
				
			if (v > max) max = v;
		}
		
		return max;
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
	}
	
	Resize() {
		var size = this.Simulation.size;
		
		size = Array.Map(size, function(s) { return (+s); });
		size = { x:size[0], y:size[1], z:size[2] };
		
		this.Widget.Resize(size);
	}
	
	Draw() {		
		this.Widget.Draw(this.state, this.z, this.palette, this.Simulation);
	}

	onSimulationMove_Handler(ev) {
		var plus = ev.direction == "next" ? 1 : -1; 
		var frame = new Frame("internal", "0");
	
		Array.ForEach(ev.frame.transitions, function(t) {			
			this.state.models[t.id] += plus;
			
			var t = new TransitionCA(t.coord, this.state.models[t.id], null);
			
			frame.AddTransition(t);
		}.bind(this));
		
		this.Widget.DrawChanges(frame, this.z, this.palette, this.Simulation);
	}
	
	onSimulationJump_Handler(ev) {		
		this.state = this.GetState(this.Simulation, ev.state.i);
		
		this.Widget.Draw(this.state, this.z, this.palette, this.Simulation);
	}
	
	onMouseMove_Handler(ev) {
		var id = ev.data.x + "-" + ev.data.y + "-" + this.z;
		var state = this.state.models[id];

		var subs = [ev.data.x, ev.data.y, this.z, state];
		
		this.tooltip.nodes.label.innerHTML = Lang.Nls("Widget_AutoTransitionMap_Tooltip_Title", subs);
	
		this.tooltip.Show(ev.x + 20, ev.y);
	}
	
	onMouseOut_Handler(ev) {
		this.tooltip.Hide();
	}
	
	Save() {
		return { name:"Auto.TransitionMap", config:{ z:this.z, min:this.min, max:this.max , n:this.n }}
	}
});