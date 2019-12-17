'use strict';

import Lang from '../utils/lang.js';
import Widget from '../ui/widget.js';
import Control from '../widgets/control.js';
import Array from '../utils/array.js';
import ModelList from '../widgets/modelList.js';
import Popup from '../ui/popup.js';
import Dom from '../utils/dom.js';

export default Lang.Templatable("Widget.ModelInput", class ModelInput extends Widget {
    constructor(id){
        super(id);

        this.popup = new Popup();
        this.popup.Widget = new ModelList();

        // Dom.RemoveCss(this.Node("list"),"disabled");

        this.Node("modelInput").addEventListener("click", this.onModelInputClick_Handler.bind(this));

        // this.Node("modelInput").On("dataReady", function(ev){
        //     console.log(ev.result);
        // })
    }

    onModelInputClick_Handler(){ 
        // Dom.ToggleCss(this.Node("list"),"enabled",true);
        this.popup.Show();
        this.Node("modelInput").On("dataReady", function(ev){
            console.log(ev.result);
        })

    }

    Template(){
        return "<div class='box d-vertical d-center'>" +
                    "<div handle='message' class='dropzone-message'>" +
                        "<div handle='message' class='dropzone-message'>" +
                            "<div class='dropzone-instructions'>nls(RISE_Server_Instructions)</div>" +
                        "</div>" +
                    "</div>" +
                    "<input handle='modelInput'/>" +
                "</div>" ;
    }
});