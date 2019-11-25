'use strict';

import Lang from '../utils/lang.js';
import Dom from '../utils/dom.js';
import Widget from '../ui/widget.js';

export default Lang.Templatable("Widget.Header", class Header extends Widget { 

	constructor(id) {
		super(id);
		this.Node("theme1").addEventListener("click", this.themeSelected.bind(this, 1));
		this.Node("theme2").addEventListener("click", this.themeSelected.bind(this, 2));
		this.Node("theme3").addEventListener("click", this.themeSelected.bind(this, 3));
		this.Node("theme4").addEventListener("click", this.themeSelected.bind(this, 4));
	}

	themeSelected(v){
		var link = document.getElementsByTagName("link");
		link[5].href = "css/theme-" + v + ".css?v=1.0";
		//document.getElementsByClassName("themes");

	}
	
	Template() {
		return	"<h1 handle='lab' class='row'>nls(Header_Lab)</h1>" +
				"<div class='row'>" +
					"<div class='header-app column'>" +
						"<h1 handle='app' class='d-inline'>nls(Header_App)</h1>" +
					"</div>" +
					"<div>" +
						"<a handle='tutorial' href='https://goo.gl/vhQE03' target='_blank'>nls(Header_Tutorial)</a> &emsp;" +
						"<a handle='sample' href='https://goo.gl/S7agHi' target='_blank'>nls(Header_Sample)</a> &emsp;" +
						"<a handle='problem' href='mailto:bruno.st-aubin@carleton.ca?Subject=[CellDEVSViewer][alpha]' target='_blank'>nls(Header_Problem)</a> &emsp;" +
					"<span handle='theme' class='theme-selector'>" +
						"<button class='theme-btn'> Theme </button>" +
						"<span id='themeOptions' class='themes'>" +
							"<span handle='theme1'>Violet</span>" +
							"<span handle='theme2'>Green</span>" +
							"<span handle='theme3'>White</span>" +
							"<span handle='theme4'>Blue</span>" +
						"</span>" +
					"</span> &emsp;" +
					"</div>" +
				"</div>";
	}
});