import { Template } from 'meteor/templating';
import { Workspaces } from '../../../../imports/collections/tenant/workspace.js';
import { Systems } from '../../../../imports/collections/tenant/system.js';
import { Connectors } from '../../../../imports/collections/global/connectors.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { ObjectsList } from '../../../../imports/collections/global/object_list.js';

import './collect.html';

Template.collect.helpers({
  systems() {
    //determines if a workspace has been selected and added to session
    if(Session.get("currentWs")) {
      ws = Session.get("currentWs");
      if(ws.id) {
        systemcount = Systems.find({"workspace_id": ws.id}).count();
        Session.set("systemCount", systemcount);
        console.log("Session systemCount: " + Session.get("systemCount"));
        return Systems.find({"workspace_id": ws.id});
      }
      else{
        Session.set("systemCount", "0");
        console.log("Session systemCount: " + Session.get("systemCount"));
        return Systems.find();
      }
    }else {
      //TODO: should not show all systems just temporary until we have more data
      Session.set("systemCount", "0");
      console.log("Session systemCount: " + Session.get("systemCount"));
      return Systems.find();
    }
  },
  external_objects() {
    //check for system and get external objects by system types
    if(Session.get("currentWs"))
    {
      var wsid = Session.get("currentWs").id;
      objectcount = ExternalObjects.find({"workspace_id": wsid}).count();
      Session.set("externalObjectCount", objectcount);
      console.log("Session externalObjectCount: " + Session.get("externalObjectCount"));
      return ExternalObjects.find({"workspace_id": wsid});
    }
    else{
      Session.set("externalObjectCount", "0");
      console.log("Session externalObjectCount: " + Session.get("externalObjectCount"));
      //TODO: remove this option after testing
      return ExternalObjects.find();
    }
  },
  connectStatus : function(){
    if(Session.get("currentWs"))
    {
      return Session.get("currentWs").connect_status;
    }
    return false;
  },
  hasObject : function(){
    if(Session.get("externalObjectCount")){
      var objectcount =  parseInt(Session.get("externalObjectCount"));
      if(objectcount > 0){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  },
  hasEnoughObject : function(){
    if(Session.get("externalObjectCount")){
      var objectcount =  parseInt(Session.get("externalObjectCount"));
      if(objectcount > 1){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  },
});

Template.collect.events({

  'click .delete' : function(){
    var errDiv = document.getElementById("addErrCollect");
    errDiv.innerHTML = ""; //reset errors

    var ws = Session.get("currentWs");
    Meteor.call('external_objects.remove', this._id, ws.id
    , (err, res) => {
      if(err){
        //console.log(err);
        //TODO: improve with error Template
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
      }
      else {
        // successful call
        // return true;
      }
    });
  },
  'click .toMatch' : function(e){
    console.log('Collect - toMatch event clicked.');
    FlowRouter.go('/setup/match');
  },
  'click .objlistddl li a' : function(e, t){
    var errDiv = document.getElementById("addErrCollect");
    errDiv.innerHTML = ""; //reset errors

    var text = e.target.text;
    document.getElementById("objectlist").value = text.toString().trim();
    var sysId = parseInt(e.target.getAttribute("data-system"));
    var name = e.target.getAttribute("data-name");

    var ws = Session.get("currentWs");
    if(ws == null){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>No Workspace selected.</li>";
      return;
    }

    //verify that variable doesn't already exist for the system
    var obj = ExternalObjects.findOne({"name": name.trim(), "system_id": sysId });
    if(obj == null){
      //console.log("ws.id: " + ws.id + "sys.id: " + sysId + " obj.id: " + thisId + " | name: " + name );
      Meteor.call('external_objects.insert'
        , ws.id, sysId, name
        , (err, res) => {
          if(err){
            //console.log(err);
            //TODO: improve with error Template
            errDiv.style.display = 'block';
            errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
          }
          else {
            // successful call
            // return true;
            Meteor.call('tasks.insert', "collectschema", ws.id, res
            , (error, result) => {
              if(error){
                //console.log(err);
                errDiv.style.display = 'block';
                errDiv.innerHTML = errDiv.innerHTML + "<li><span>CollectSchema Error: </span>[ " + error.error + "] " + error.reason + "</li>";
                //return false;
                return;
              }
              else {
                // successful call
                Meteor.call('tasks.insert', "collect", ws.id, res
                , (err, res) => {
                  if(err){
                    //console.log(err);
                    errDiv.style.display = 'block';
                    errDiv.innerHTML = errDiv.innerHTML + "<li><span>Collect Error: </span>[" + err.error + "] " + err.reason + "</li>";
                    //return false;
                    return;
                  }
                  else {
                    // successful call

                    Modal.hide('systemaddmodal');
                  }
                });
              }
            });
          }
        });
    }
    else{
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span> ExternalObject already exists.</li>";
    }
  },
  'click .addobj a' : function(e, t){
    var errDiv = document.getElementById("addErrCollect");
    errDiv.innerHTML = ""; //reset errors

    var text = e.target.childNodes[4].textContent + " - " +  e.target.childNodes[1].textContent;
    document.getElementById("objectlist").value = text;
    var sysId = parseInt(e.target.childNodes[7].textContent);
    var name = e.target.childNodes[1].textContent;

    var ws = Session.get("currentWs");
    if(ws == null){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>No Workspace selected.</li>";
      return;
    }

    //verify that variable doesn't already exist for the system
    var obj = ExternalObjects.findOne({"name": name.trim(), "system_id": sysId });
    if(obj == null){
      //console.log("ws.id: " + ws.id + "sys.id: " + sysId + " obj.id: " + thisId );
      Meteor.call('external_objects.insert'
        , ws.id, sysId, name
        , (err, res) => {
          if(err){
            //console.log(err);
            //TODO: improve with error Template
            errDiv.style.display = 'block';
            errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
          }
          else {
            // successful call
            // return true;
            Meteor.call('tasks.insert', "collectschema", ws.id, res
            , (error, result) => {
              if(error){
                //console.log(err);
                errDiv.style.display = 'block';
                errDiv.innerHTML = errDiv.innerHTML + "<li><span>CollectSchema Error: </span>[ " + error.error + "] " + error.reason + "</li>";
                //return false;
                return;
              }
              else {
                // successful call
                Meteor.call('tasks.insert', "collect", ws.id, res
                , (err, res) => {
                  if(err){
                    //console.log(err);
                    errDiv.style.display = 'block';
                    errDiv.innerHTML = errDiv.innerHTML + "<li><span>Collect Error: </span>[" + err.error + "] " + err.reason + "</li>";
                    //return false;
                    return;
                  }
                  else {
                    // successful call

                    Modal.hide('systemaddmodal');
                  }
                });
              }
            });
          }
        });
    }
    else{
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span> External Objects already exist.</li>";
    }
  },
});

Template.collectZeroObjHeader.helpers({
  hasWorkspace : function(){
    if(Session.get("currentWs")){
      return true;
    }
    else {
      return false;
    }
  },
  hasSystems : function(){
    if(Session.get("systemCount")){
      var sysCnt = parseInt(Session.get("systemCount"));
      if(sysCnt > 0){
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  },
});

Template.systemObjectList.helpers({
  getObjectName : function(id){
    var i = parseInt(id);
    //var c = ObjectsList.find({"id" : id}).count();
    //alert("count: " + c);
    var curObj = ObjectsList.findOne({"id": id});
    return curObj.name;
  },
  getSystemName : function(id){
    if(Session.get("currentWs")){
      var curSys = Systems.findOne({"id":id});
      return curSys.name;
    }
    else {
      console.log("no workspace selected");
      return "DefaultSystem";
    }
  },
  doesntExist : function(name, id){
    var extObj = ExternalObjects.findOne({"system_id": id, "name": name});
    if(extObj){
      return false;
    }
    return true;
  }
});

Template.objectList.helpers({
  getObjectName : function(id){
    var i = parseInt(id);
    //var c = ObjectsList.find({"id" : id}).count();
    //alert("count: " + c);
    var curObj = ObjectsList.findOne({"id": id});
    return curObj.name;
  },
  getSystemName : function(id){
    var curSys = Systems.findOne({"id":id});
    return curSys.name;
  },
  getConnectorName : function(id){
    var curSys = Systems.findOne({"id":id});
    var curCon = Connectors.findOne({"id": curSys.connector_id});
    return curCon.name;
  },
  doesntExist : function(name, id){
    var extObj = ExternalObjects.findOne({"system_id": id, "name": name});
    if(extObj){
      return false;
    }
    return true;
  }
});

Template.collectObj.helpers({
  getObjectName : function(id){
    var i = parseInt(id);
    //var c = ObjectsList.find({"id" : id}).count();
    //alert("count: " + c);
    var curObj = ObjectsList.findOne({"id": id});
    return curObj.name;
  },
  getSystemName : function(id){
    var curSys = Systems.findOne({"id":id});
    return curSys.name;
  },
  getConnectorName : function(id){
    var curSys = Systems.findOne({"id":id});
    var curCon = Connectors.findOne({"id": curSys.connector_id});
    return curCon.name;
  },
});


Meteor.subscribe('workspaces', function (){
  console.log( "Collect - Workspaces now subscribed.");
});

Meteor.subscribe('systems', function (){
  console.log( "Collect - Systems now subscribed.");
});

Meteor.subscribe('connectors', function (){
  console.log( "Collect - Connectors now subscribed.");
});

Meteor.subscribe('objects_list', function (){
  console.log( "Collect - ObjectsList now subscribed.");
});

Meteor.subscribe('external_objects', function (){
  console.log( "Collect - ExternalObjects now subscribed.");
});
