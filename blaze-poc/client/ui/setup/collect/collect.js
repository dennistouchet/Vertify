import { Template } from 'meteor/templating';
import { Workspaces } from '../../../../imports/collections/tenant/workspace.js';
import { Systems } from '../../../../imports/collections/tenant/system.js';
import { Objects } from '../../../../imports/collections/tenant/object.js';
import { ObjectsList } from '../../../../imports/collections/global/object_list.js';
import { SystemObjects } from '../../../../imports/collections/tenant/system_object.js';

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
  objects() {
    //check for system and get objects by system types
    if(Session.get("currentWs"))
    {
      var wsid = Session.get("currentWs").id;
      objectcount = Objects.find({"workspace_id": wsid}).count();
      Session.set("objectCount", objectcount);
      console.log("Session objectCount: " + Session.get("objectCount"));
      return Objects.find({"workspace_id": wsid});
    }
    else{
      Session.set("objectCount", "0");
      console.log("Session objectCount: " + Session.get("objectCount"));
      //TODO: remove this option after testing
      return Objects.find();
    }
  },
  system_objects(){
    if(Session.get("currentWs"))
    {
      Meteor.call('system_objects.removeAll');
      var wsid = Session.get("currentWs").id;

      var sysSet = Systems.find({"workspace_id": wsid });
      var sysList = [];
      console.log("sysSet: " + sysSet);

      sysSet.forEach(function (syst) {
        sysList.push(syst.id);

        var objSet = Objects.find({"system_id": syst.id});
        var objList = [];
        objSet.forEach(function (objl) {
          objList.push(objl.object_id);
        });
        console.log("objList count: " +  objList.length);

        var sysObjs = ObjectsList.find({ "connector_id": syst.connector_id, "id": {$nin : objList}});
        var sysobjlist = [];
        sysObjs.forEach(function (so){
          sysobjlist.push(so.id);
          console.log("sysobjlist id: " +  so.id);
        });
        console.log("system_objects.insert:" +  sysobjlist + " | " + syst.id + " | " + syst.name + " | " + wsid)
        Meteor.call('system_objects.insert', sysobjlist, syst.id, syst.name, wsid);
      });
      console.log("sysList: " + sysList);

      return SystemObjects.find({"system_id": {$in : sysList}, "workspace_id" : wsid});
    }
    //TODO: remove this after collect is complete
    //return ObjectsList.find();
  },
  connectStatus : function(){
    if(Session.get("currentWs"))
    {
      return true;
    }
    return false;
  },
  hasObject : function(){
    if(Session.get("objectCount")){
      var objectcount =  parseInt(Session.get("objectCount"));
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
    if(Session.get("objectCount")){
      var objectcount =  parseInt(Session.get("objectCount"));
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
      Meteor.call('objects.remove', this._id);
  },
  'click .toMatch' : function(e){
    console.log('Collect - toMatch event clicked.');
    FlowRouter.go('/setup/collect');
  },
  'click .objlistddl li a' : function(e, t){
    var text = e.target.text;
    document.getElementById("objectlist").value = text;
    var thisId = parseInt(e.target.getAttribute("data-id"));
    var sysId = e.target.getAttribute("data-system");
    var name = e.target.getAttribute("data-name");

    var ws = Session.get("currentWs");
    if(ws == null){
      alert("Error: No workspace selected");
      return;
    }

    //verify that variable doesn't already exist for the system
    var obj = Objects.findOne({"object_id": thisId, "system_id": sysId });
    if(obj == null){
      console.log("ws.id: " + ws.id + "sys.id: " + sysId + " obj.id: " + thisId + " | name: " + name );
      Meteor.call('objects.insert', ws.id, sysId, thisId, name);
    }
    else{
      alert("Error: Object already exists.");
    }
  },
  'click .addobj a' : function(e, t){
    var text = e.target.childNodes[7].textContent + " | " +  e.target.childNodes[4].textContent;
    document.getElementById("objectlist").value = text;
    var thisId = parseInt(e.target.childNodes[1].textContent);
    var sysId = e.target.childNodes[10].textContent;
    var name = e.target.childNodes[4].textContent;

    var ws = Session.get("currentWs");
    if(ws == null){
      alert("Error: No workspace selected");
      return;
    }

    //verify that variable doesn't already exist for the system
    var obj = Objects.findOne({"object_id": thisId, "system_id": sysId });
    if(obj == null){
      //console.log("ws.id: " + ws.id + "sys.id: " + sysId + " obj.id: " + thisId );
      Meteor.call('objects.insert', ws.id, sysId, thisId, name);
    }
    else{
      alert("Error: Object already exists.");
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
    var curSys = Systems.findOne({"id":id});
    return curSys.name;
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
  }
});


Meteor.subscribe('workspaces', function (){
  console.log( "Collect - Workspaces now subscribed.");
});

Meteor.subscribe('systems', function (){
  console.log( "Collect - Systems now subscribed.");
});

Meteor.subscribe('system_objects', function (){
  console.log( "Collect - SystemObjects now subscribed.");
});

Meteor.subscribe('objects_list', function (){
  console.log( "Collect - ObjectsList now subscribed.");
});

Meteor.subscribe('objects', function (){
  console.log( "Collect - Objects now subscribed.");
});
