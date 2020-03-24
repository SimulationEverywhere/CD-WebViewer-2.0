'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Dom from '../../utils/dom.js';
import Tooltip from '../../ui/tooltip.js';
import Selector from './selector.js';
import Automated from '../automated.js';

import GridLayer from '../gridLayer/auto.js';
import GridLayerConfig from '../gridLayer/config.js';
import CellTrack from '../cellTrack/auto.js';
import CellTrackConfig from '../cellTrack/config.js';
import StateSum from '../stateSum/auto.js';
import StateSumConfig from '../stateSum/config.js';
import TransitionMap from '../transitionMap/auto.js';
import TransitionMapConfig from '../transitionMap/config.js';
import DevsDiagram from '../devsDiagram/auto.js';
import DevsDiagramConfig from '../devsDiagram/config.js';

let AUTOS = [{
		id : "gridLayer",
		nls : "Widget_AutoGrid",
		definition : GridLayer,
		configurator : GridLayerConfig
	}, {
		id : "cellTrack",
		nls : "Widget_AutoCellTrackChart",
		definition : CellTrack,
		configurator : CellTrackConfig
	}, {
		id : "stateSum",
		nls : "Widget_AutoStateChart",
		definition : StateSum,
		configurator : StateSumConfig
	}, {
		id : "transitionMap",
		nls : "Widget_AutoTransitionMap",
		definition : TransitionMap,
		configurator : TransitionMapConfig
	},{
		id : "devsDiagram",
		nls : "Widget_AutoDevsDiagram",
		definition : DevsDiagram,
		configurator : DevsDiagramConfig
	}];


let SIMULATORS = {
		"Lopez" : ["gridLayer", "cellTrack", "stateSum", "transitionMap"],
		"CDpp" : ["gridLayer", "cellTrack", "stateSum", "transitionMap"],
		"DEVS" : ["cellTrack", "stateSum", "devsDiagram"],
		"FSM"  : ["cellTrack", "stateSum","devsDiagram"]
	}
	
export default Lang.Templatable("Auto.Selector", class AutoSelector extends Automated { 
	
	constructor(config, simulation) {
		super(new Selector(), simulation);
		
		this.Widget.LoadItems(this.Widgets(simulation.simulator));
		
		this.Widget.On("Load", this.onWidgetLoad_Handler.bind(this));
	}
	
	Refresh() {
		
	}
	
	Destroy() {
		super.Destroy();
		
		this.Widget.Destroy();
	}
	
	Save() {
		return { name:"Auto.Selector" };
	}
	
	onWidgetLoad_Handler(ev) {
		
		if(ev.configurator.name=='ConfigDevsDiagram'){
			this.Emit("Load", { definition:ev.definition  });
		}
		else
			this.Emit("Load", { definition:ev.definition, configurator:ev.configurator  });
	}
	
	Widgets(simulator) {
		var list = SIMULATORS[simulator];
		
		return Array.Filter(AUTOS, function(w) { return list.indexOf(w.id) > -1; });
	}
});