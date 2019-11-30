'use strict';

import Cell from './cell.js';
import Last from './last.js';
import Widget from '../ui/widget.js';
import Array from '../utils/array.js';
import Lang from '../utils/lang.js';
import Dom from '../utils/dom.js';

export default Lang.Templatable("UI.Dashboard", class Dashboard extends Widget { 

	set Settings(value) { 
		this.settings = value; 
		
		this.settings.On("Change", this.onSettingsChange_Handler.bind(this));
	}

	constructor(container, options) {
		super(container, options);
		
		this.cells = [];
		
		this.AddLastCell();
	}
	
	Empty () {
		for (var i = this.cells.length; i > 0; i--) {
			this.RemoveCell(this.cells[i - 1]);
		}
	}
	
	AddLastCell(height) {
		this.last = new Last(this.container);
		
		this.last.Resize(height);
		
		this.last.On("Click", (ev) => { this.AddCell(); });
	}
	
	AddCell() {
		var cell = new Cell(this.container);
		
		cell.Resize(this.settings.RowHeight);
		
		cell.On("Close", this.onCellClose_Handler.bind(this));
		cell.On("Span", this.onCellSpan_Handler.bind(this, cell));
		
		this.cells.push(cell);
		
		Dom.Place(this.last.Root, this.container);
		
		this.Emit("NewCell", { cell:cell });
		
		this.Resize();
		
		return cell;
	}
	
	RemoveCell(cell) {
		Dom.Remove(cell.Root, this.container);
		
		var idx = this.cells.indexOf(cell);
		
		var removed = this.cells.splice(idx, 1);
		
		removed[0].Widget.Destroy();
		
		this.Resize();
	}
	
	Resize() {
		Array.ForEach(this.cells, function(c) { 
			c.Resize(this.settings.RowHeight);
		}.bind(this));
		
		this.last.Resize(this.settings.RowHeight);
	}
	
	onCellClose_Handler(ev) {
		this.RemoveCell(ev.cell);
	}
	
	onCellSpan_Handler(ev) {
		this.Resize();
	}
	
	onSettingsChange_Handler(ev) {
		if (ev.property == "rowHeight") this.Resize();
	}
});