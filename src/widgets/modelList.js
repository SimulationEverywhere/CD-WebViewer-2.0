'use strict';

import Lang from '../utils/lang.js';
import Widget from '../ui/widget.js';
import Control from '../widgets/control.js';
import Array from '../utils/array.js';

export default Lang.Templatable("Widget.ModelList", class ModelList extends Widget {

    constructor(id) {
        super(id);

        this.files = null;

        this.Node("lifeModel").addEventListener("click", this.onModelInputClick_Handler.bind(this));
    }

    onModelInputClick_Handler(){

        var modelNames = ['Life','Fire','Cancer','Battle'];

        var xhrRise = new XMLHttpRequest();
        var _rootThis = this;
        xhrRise.onload = function(){
            var response = JSON.parse(this.response);   
            console.log(response["modelData"][0]["modelName"]);
            console.log(response["modelCount"]);
            console.log(response["modelData"][3]["modelUrl"]);

            var ul = document.getElementById("myUL");
            
            for(var i = 0;i<response["modelCount"];i++){
                var li = document.createElement("li");
                li.setAttribute('id', response["modelData"][i]["modelName"]);
                li.appendChild(document.createTextNode(response["modelData"][i]["modelName"]));
                ul.appendChild(li);
    
            }
            
            document.getElementById('Life').addEventListener('click',function(){
                _rootThis.getRiseModel(response["modelData"][0]["modelUrl"])}
            )

            
            document.getElementById('Fire').addEventListener('click',function(){
                _rootThis.getRiseModel(response["modelData"][1]["modelUrl"])}
            )

            document.getElementById('Cancer').addEventListener('click',function(){
                _rootThis.getRiseModel(response["modelData"][2]["modelUrl"])}
            )

            document.getElementById('Battle').addEventListener('click',function(){
                _rootThis.getRiseModel(response["modelData"][3]["modelUrl"])}
            )
        }        

        xhrRise.open("GET","https://arnavk2319.github.io/CD-WebViewer-2.0/modelDetails.json",true);
        xhrRise.setRequestHeader("Content-type","application/json");
        xhrRise.responseType = 'text'; 
        xhrRise.send();

        var modelButton = document.getElementById("modelLife");
        modelButton.style.display = "none";
        
    }


    getRiseModel(modelUrl){
        console.log("hello again");

        var xhr = new XMLHttpRequest();
        var _root = this;
   
       xhr.onload = function(e) {
           // var responseArray = new Uint8Array(this.response);
           var blobData = new Blob([this.response],{type : "application/zip"});
           zip.createReader(new zip.BlobReader(blobData), function(zipReader){
               zipReader.getEntries(function(entries){
                       
                       entries[1].getData(new zip.TextWriter(), function(text){
                               
                               var newBlob = new Blob([text],{type: "text/plain"})
                               var fileName = entries[1].filename;
                               var fileValue = new File([newBlob],fileName);

                               _root.files = [{ name:fileValue.name, content:null, raw:fileValue }];
                               
                               _root.Emit("dataReady", {
                                   result : _root.files});                            
   
                               zipReader.close(function(){
   
                               });
                       },function(current,total){
                           //progress callback
                       });
               });
           },function(error){
               console.log(error);
           });
       };

    //    var url = `http://vs1.sce.carleton.ca:8080/cdpp/sim/workspaces/test/dcdpp/${modelName}/results.zip`;
   
        xhr.open("GET",modelUrl,true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", "http://vs1.sce.carleton.ca:8080");
        xhr.setRequestHeader("Content-type","application/zip");
        xhr.responseType = 'blob';    
        xhr.send();
       
    }


    Template(){
        return "<ul id='myUL'>" +
                "</ul>" +
                "<button handle='lifeModel' id='modelLife' class='load' value='Show Models from RISE'>nls(RISE_Server_Instructions)</button>" ;
    }

});