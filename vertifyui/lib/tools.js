import { Meteor } from  "meteor/meteor";
import { Systems } from "../imports/collections/tenant/system.js";
import { Connectors } from '../imports/collections/global/connector.js';
import { ExternalObjects } from "../imports/collections/tenant/external_object.js";
import { MatchSetup } from "../imports/collections/tenant/match_setup.js";
import { VertifyObjects } from "../imports/collections/tenant/vertify_object.js";
import { VertifyProperties } from '../imports/collections/tenant/vertify_property.js';

Meteor.tools = {
  /*******************************************
            GENERAL CASE TOOLS
  *******************************************/
  myAlert : function(msg) {
    alert(msg);

    if (msg == null){
      return false;
    }
    return true;
  },
  CapitalizeFirstLetter : function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  },
  randomUUID : function(){
    var date = new Date().getTime();
    // user higher precision if available
    if(window.performance && typeof window.performance.now === "function"){
      date += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(char) {
      var rand = (date + Math.random()*16)%16 | 0;
      date = Math.floor(date/16);
      return (char=='x' ? rand : (rand&0x3|0x8)).toString(16);
    });
    return uuid;
  },
  taskRunner : function(ws_id, objectid, tasktype, other){

  },
  compare : function(a,b){
    if( a.name < b.name)
      return -1;
    if( a.name > b.name)
      return 1;
    return 0;
  },
  /*******************************************
            SPECIFIC CASE TOOLS
  *******************************************/
  connectStatus : function(ws_id){
    var systemCount = Systems.find({"workspace_id": ws_id}).count();
    if(systemCount > 1)
    {
      return true;
    }
    return false;
  },
  collectStatus : function(ws_id){
    var externalObjectCount = ExternalObjects.find({"workspace_id": ws_id}).count();
    if(this.connectStatus(ws_id) && (externalObjectCount > 1))
    {
      return true;
    }
    return false;
  },
  matchStatus : function(ws_id){
    //TODO: adjust to be more precise
    var complete = false;
    var vertifyObjectsExist = VertifyObjects.find({"workspace_id": ws_id, match: true});
    if(this.collectStatus(ws_id) && vertifyObjectsExist){

      vertifyObjectsExist.forEach(function(vo){

        var voextobj = vo.external_objects;
        if(voextobj){
          voextobj.forEach(function(voeo){
            if(voeo.approved) complete = voeo.approved;
          });
        }
      });
    }
    return complete;
  },
  alignStatus : function(ws_id){
    var approvedVPs = false;
    var approvedVO = false;

    if(this.matchStatus(ws_id)){
      var vertifyPropertiesExist = VertifyProperties.find({"workspace_id": ws_id});
      if(vertifyPropertiesExist.count() > 0){
        vertifyPropertiesExist.forEach(function(vprop){
        if(vprop.align) approvedVPs = vprop.align;
        });
      }
      var vertifyObjectsExist = VertifyObjects.find({"workspace_id": ws_id});
      if(vertifyObjectsExist.count() > 0){
        vertifyObjectsExist.forEach(function(vobj){
          if(vobj.align) approvedVO = vobj.align;
        });
      }
    }
    if(approvedVPs && approvedVO){
      return true;
    }
    else{
      return false;
    }
  },
  setupStatus : function(ws_id, status){
    if(status == "Connect"){
      return this.connectStatus(ws_id);
    }
    else if(status == "Collect"){
      return this.collectStatus(ws_id);
    }
    else if(status == "Match"){
      return this.matchStatus(ws_id);
    }
    else if(status == "Align"){
      return this.alignStatus(ws_id);
    }
    else{
      return false;
    }
  },
  getQueryParamByName: function(name, url){
    if(!url)
      url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);

    if(!results) return null;
    if(!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  },
  convertMatchSetuptoVertifyObj : function(ws_id, msid){
    //console.log("Convert values = ws_id: " + ws_id + " | msid: " + msid );

    //TODO: Check Vertify object with current External Object doesn't already exist.
    MatchObject = MatchSetup.findOne({"id": msid, "workspace_id": ws_id});
    if(MatchObject){
      //Create new VO
      if(MatchObject.new_object){
          Meteor.call('vertify_objects.insert', MatchObject);
      }//Update Existing VO
      else{
        //TODO: this function doesn't exist
        // NOT HAPPY PATH
        // Will be used to ADD TO EXISTING VO's that are in progress
          Meteor.call('vertify_objects.update', MatchObject);
      }
    }
    else{
      throw new Meteor.Error("Error","Error Retrieving Match Setup Object");
    }
  },
  proceedToNextStep : function (t, step){
    t.currentTab.set( step );

    var tabs = $(".nav-pills li");
    tabs.removeClass("active");

    var currentTab = $("ul").find("[data-template='" + step + "']");
    currentTab.addClass("active");
  },
  updateAlignStatus: function(ws_id, vo, field, status){
    Meteor.call('vertify_objects.updateStatus', ws_id, vo, 'align', status
    , (err, res) => {
      if(err){
        console.log("Tools.js updateAlignStatus error:");
        console.log(err);
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Vertify Object " + err.error + "] " + err.reason + "</li>";
        //return false;
        return;
      }else {
        console.log("Vertify Object align status update success");
        //success
        console.log("result: "+res);
      }
    });
  },
  updateSystemStatus: function(ws_id, id, field, status){
    Meteor.call('systems.updateStatus', ws_id, id, field, status
    , (err, res) => {
      if(err){
        console.log("Tools.js updateSystemStatus error:");
        console.log(err);
      }else {
        //console.log("System " + field + " status update success");
        //console.log("result: "+res);
      }
    });
  },
  /*******************************************
        HAPPY PATH MOCKING FUNCTIONS
  *******************************************/
  getExternalObjects : function(ws_id, conn_id){
    console.log("getExternalObjects Called from tools.js");

    var netsuiteExternalObjects = [{
          name: "Netsuite Customer",
          is_dynamic: false
        },{
          name: "Netsuite Object",
          is_dynamic: false
        }];

    var marketoExternalObjects = [{
          name: "Marketo LeadRecord",
          is_dynamic: true
        },{
          name: "Marketo Agent",
          is_dynamic: true
        },{
          name: "Market Object",
          is_dynamic: true
        }];

    var jiraExternalObjects = [{
          name: "Jira Issue",
          is_dynamic: true
        }];

    var salesforceExternalObjects = [{
          name: "Salesforce User",
          is_dynamic: true
        },{
          name: "Salesforce Customer",
          is_dynamic: true
        }];
    /*
    var system = Systems.findOne({"id": sysid});
    if(system){
      sysid = system.connector_id;
    }
    console.log(system);*/
    //TODO: verify why this uses sysid - rename var to connid?
    var extobj = null;
    var connector = Connectors.findOne({"id": conn_id});
    if(connector){
      if(connector.id == 100000){
        extobj = netsuiteExternalObjects;
      }
      else if (connector.id == 111111){
        extobj = marketoExternalObjects;
      }
      else if (connector.id == 222222){
        extobj = salesforceExternalObjects;
      }
      else if (connector.id == 444444){
        extobj = jiraExternalObjects;
      }
    }
    return extobj;
  },
  getExternalObjectProperties: function(ws_id, sysid){
    console.log("getExternalObjectProperties Called from tools.js");

    var ExternalObjectProperties1 = [{
      name: "internalId",
      is_custom: false,
      is_array: false,
      type: "integer",
      is_key: true
    },
    {
      name: "firstName",
      is_custom: false,
      is_array: false,
      type: "string",
      is_key: false
    },
    {
      name: "company",
      is_custom: false,
      is_array: false,
      type: "string",
      is_key: false
    }];

    var ExternalObjectProperties2 = [{
      name: "Id",
      is_custom: false,
      is_array: false,
      external_type: "System.Int32",
      type: "integer",
      is_key: true
    },
    {
      name: "Email",
      is_custom: false,
      is_array: false,
      external_type: "System.String",
      type: "string",
      is_key: false
    },
    {
      name: "CompanyId",
      is_custom: false,
      is_array: false,
      external_type: "System.Int32",
      type: "integer",
      is_key: true
    },
    {
      name: "leadAttributeList",
      is_custom: false,
      is_array: false,
      external_type: "System.String",
      type: "string",
      is_key: false
    },
    {
      name: "leadAttributeList.FirstName",
      is_custom: false,
      is_array: false,
      external_type: "System.String",
      type: "string",
      is_key: false
    },
    {
      name: "leadAttributeList.LastName",
      is_custom: false,
      is_array: false,
      external_type: "System.String",
      type: "string",
      is_key: true
    },
    {
      name: "leadAttributeList.Email",
      is_custom: false,
      is_array: false,
      external_type: "System.String",
      type: "string",
      is_key: true
    },
    {
      name: "leadAttributeList.Company",
      is_custom: false,
      is_array: false,
      external_type: "System.Int32",
      type: "string",
      is_key: false
    }];

    var properties = null;
    var system = Systems.findOne({"workspace_id": ws_id, "id": sysid});
    if(system){
      if(system.connector_id == 100000 ){
        properties = ExternalObjectProperties1;
        console.log("tools.js | inside property assignment");
      }
      else if (system.connector_id ==  111111 || system.connector_id === 222222){
        properties = ExternalObjectProperties2;
        console.log("inside property assignment");
      }
      else if (system.connector_id === 444444){
        properties = ExternalObjectProperties1;
        console.log("inside property assignment");
      }
    }
    return properties;

  },
  doTimeout(method, objid, i){
    setTimeout( function() {
      //Make update call to percentage
      Meteor.call(method, objid, i);
    }, (5000 + (i * 100)));
  },
  artificalProgressBarLoading: function(task, objid){
    console.log("trigger " + task + " loading...");

    if(task == "collect"){
        //TODO
        console.log("Collect loading. Id: " + objid);
        for(i = 0; i < 100; i++){
          var j = i + 1;
          this.doTimeout('external_objects.updateLoading', objid, j);
        }
    }else if(task == "match"){
      //TODO
      console.log("Match loading. Id: " + objid);
      for(i = 0; i < 100; i++){
        var j = i + 1;
        //this.doTimeout('vertify_objects.updateLoading', objid, j);
      }
    }else if(task == "align"){
      //TODO
      console.log("Align loading. Id: " + objid);
      for(i = 0; i < 100; i++){
        var j = i + 1;
        //this.doTimeout('vertify_properties.updateLoading', objid, j);
      }
    }else if(task == "analyze"){
      //TODO
      console.log("Analyze loading. Id: " + objid);
      for(i = 0; i < 100; i++){
        var j = i + 1;
        this.doTimeout('vertify_objects.updateLoading', objid, j);
      }
    }else if(task == "fix"){
      //TODO
      console.log("Fix loading. Id: " + objid);
      for(i = 0; i < 100; i++){
        var j = i + 1;
        //this.doTimeout('vertify_objects.updateLoading', objid, j);
      }
    }
  },
  updateVertifyPropertyAlignStatus: function(ws_id, vobjid){
    var vertifyPropertiesExist = VertifyProperties.find({"workspace_id": ws_id, "vertify_object_id": vobjid});
    if(vertifyPropertiesExist){
      console.log("TODO: this mock method is incomplete and does not update VertifyProperty collection");
      vertifyPropertiesExist.forEach(function(vp){
        var vpextobj = vp.external_objects;
        if(vpextobj){
        vpextobj.forEach(function(vpeo){
          vpeo.approved = true;
        });
      }
      });
    }
    else{
      throw new Meteor.Error("Missing Values", "No Vertify Properties found with the Vertify Object Id: " + vobjid);
    }
  }
}
