'use strict';

import nls from './nls.js';
import Lang from './utils/lang.js';
import Net from './utils/net.js';
import Array from './utils/array.js';
import Dom from './utils/dom.js';
import Widget from './ui/widget.js';
import Header from './widgets/header.js';
import Control from './widgets/control.js';
import Dashboard from './ui/dashboard.js';
import Session from './simulation/session.js';
import AutoSelector from './auto/selector/auto.js';

export default class Main extends Widget { 

	constructor(node) {		
		Lang.locale = "en";
		Lang.nls = nls;
		
		super(node);
		
		this.Node("control").On("Ready", this.onControlReady_Handler.bind(this));
		this.Node("control").On("Save", this.onControlSave_Handler.bind(this));
		
		this.Node("dashboard").Settings = this.Node("control").Settings;
		this.Node("dashboard").On("NewCell", this.onDashboardNewCell_Handler.bind(this));
		this.Node("dashboard").Resize();
	}
	
	onControlReady_Handler(ev) {
		Dom.RemoveCss(this.Node("dashboard").container, "hidden");
		
		this.simulation = ev.simulation;
		
		this.simulation.On("Error", this.onError_Handler.bind(this));
		
		this.session = new Session(this.simulation, this.Node("dashboard"), this.Node("control"));
		
		this.Node("dashboard").Empty();
			
		if (ev.config) this.session.Load(ev.config);
		
		else this.Node("dashboard").AddCell();
	}
	
	onDashboardNewCell_Handler(ev) {	
		ev.cell.SetWidget(new AutoSelector(null, this.simulation));
		
		ev.cell.Widget.On("Load", this.onSelectorLoad_Handler.bind(this, ev.cell));	
	}
	
	onSelectorLoad_Handler(cell, ev) {
		cell.Empty();
			
		if (ev.configurator) { 		
			cell.SetWidget(new ev.configurator());
			
			cell.Widget.On("Configured", this.onWidgetConfigured_Handler.bind(this, cell, ev.definition));
		}
		else this.SetWidgetInCell(cell, ev.definition, null);
	}

	onWidgetConfigured_Handler(cell, definition, ev) {		
		this.SetWidgetInCell(cell, definition, ev.configuration);
	}
	
	onError_Handler(ev) {
		alert(ev.error.ToString())
	}
	
	onControlSave_Handler() {
		
		Net.Download(this.simulation.name + ".json", this.session.Save());
	}
	
	SetWidgetInCell(cell, definition, configuration) {
		var auto = new definition(configuration, this.simulation);
	
		cell.Empty();
		cell.SetWidget(auto);
		cell.Widget.Refresh();
	}
	
	Template() {
		return	"<div class='main'>" +
					"<div id='header' class='header row' widget='Widget.Header'></div>" +
					"<div handle='control' class='control row' widget='Widget.Control'></div>" +
					"<div handle='dashboard' class='dashboard hidden' widget='UI.Dashboard'></div>" +
				"</div>";
	}
}