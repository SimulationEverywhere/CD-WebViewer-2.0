'use strict';

import Array from '../utils/array.js';

export default class State { 

	constructor(i, grid) {
		this.i = i;
		this.grid = grid;
	}
	
	Clone(){
		return new State(this.i, Array.Clone(this.grid));
	}
	
	GetValue(x, y, z) {
		return this.grid[x][y][z];
	}
	
	SetValue(x, y, z, value) {
		this.grid[x][y][z] = value;
	}
	
	ApplyTransitions(frame) {
		Array.ForEach(frame.transitions, function(t) {												
			this.SetValue(t.X, t.Y, t.Z, t.Value);
		}.bind(this));
		
		this.i++;
	}
	
	RollbackTransitions(frame) {
		Array.ForEach(frame.transitions, function(t) {
			var value = this.GetValue(t.X, t.Y, t.Z) - t.Diff;
			
			this.SetValue(t.X, t.Y, t.Z, value);
		}.bind(this));
		
		this.i--;
	}
	
	static Zero(size, value) {		
		var grid = [];
		var v = value || 0;
		
		for (var i = 0; i < size.x; i++) {
			grid.push([]);
			
			for (var j = 0; j < size.y; j++) {
				grid[i].push([]);
			
				for (var k = 0; k < size.z; k++) {
					grid[i][j].push(v);
				}
			}
		}
		
		return new State(-1, grid);
	}
}