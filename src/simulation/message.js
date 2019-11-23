'use strict';

export default class Message { 

	constructor(id, time, coord, value) {
		this.id = id;
		this.time = time;
		this.coord = coord;
		this.value = value;
	}
}