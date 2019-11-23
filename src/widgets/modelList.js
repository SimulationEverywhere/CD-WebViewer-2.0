'use strict';

import Lang from '../utils/lang.js';
import Widget from '../ui/widget.js';
import Control from '../widgets/control.js';
import Array from '../utils/array.js';
import Popup from '../ui/popup.js';
import ModelInput from '../widgets/modelInput.js';

export default Lang.Templatable("Widget.ModelList", class ModelList extends Widget {

    constructor(id) {
        super(id);

        this.files = null;

        this.popup = new Popup();

        this.Node("lifeModel").addEventListener("click", this.onLifeModelClick_handler.bind(this));
        this.Node("fireModel").addEventListener("click", this.onFireModelClick_handler.bind(this));
        this.Node("cancerModel").addEventListener("click" , this.onCancerModelClick_handler.bind(this));
        this.Node("battleModel").addEventListener("click",this.onBattleModelClick_handler.bind(this));
    }

    onBarberModelClick_handler(ev){
        console.log("hello");
        var barberModel = "barber";
        this.getRiseModel(barberModel);
    }

    onLifeModelClick_handler(ev) {
        var lifeModel = 'LifeModel';
        this.getRiseModel(lifeModel);
    }

    onBattleModelClick_handler(ev){
        var battleModel = 'BattleModel';
        this.getRiseModel(battleModel);
    }

    onCancerModelClick_handler(ev){
        var cancerModel = 'CancerModel';
        this.getRiseModel(cancerModel);
    }

    onFireModelClick_handler(ev){
        var fireModel = 'FireModel';
        this.getRiseModel(fireModel);
    }

    getRiseModel(modelName){
		var xhr = new XMLHttpRequest();
		var _root = this;

		xhr.onload = function(e) {
			var blobData = new Blob([this.response],{type : "application/zip"});
		   
			zip.createReader(new zip.BlobReader(blobData), function(zipReader){
				zipReader.getEntries(function(entries){
					entries[1].getData(new zip.TextWriter(), function(text){
						var newBlob = new Blob([text],{type: "text/plain"})
						var fileName = entries[1].filename;
						var fileValue = new File([newBlob],fileName);

						_root.files = [{ name:fileValue.name, content:null, raw:fileValue }];
						  
						_root.Emit("dataReady", { result : _root.files });

						zipReader.close(function(){  });
				   },
				   function(current,total){
					   //progress callback
				   });
               });
			},function(error){

			});
		};

		var url = `http://vs1.sce.carleton.ca:8080/cdpp/sim/workspaces/test/dcdpp/${modelName}/results.zip`;

		xhr.open("GET", url,true);
		// xhr.setRequestHeader("Access-Control-Allow-Origin", "https://vs1.sce.carleton.ca:8080");
		// xhr.setRequestHeader("Content-type","application/zip");
		xhr.responseType = 'blob';    
		xhr.send();
    }

    Template(){
        return "<ul id='myUL'>" +
                    "<li handle='lifeModel'>Life Model</li>" +
                    "<li handle='fireModel'>Fire Model</li>" +
                    "<li handle='cancerModel'>Cancer Model</li>" +
                    "<li handle='battleModel'>Battle Model</li>" +
                "</ul>" ;
    }
});