'use strict';

import Lang from '../../utils/lang.js';
import Evented from '../../components/evented.js';

export default class Parser extends Evented { 

	constructor(files) {
		super();
		
		this.files = files;
	}
	
	IsValid() {		
		throw new Error("Parsers must implement a IsValid() function");
	}
	
	Parse() {		
		throw new Error("Parsers must implement a Parse() function");
	}
}