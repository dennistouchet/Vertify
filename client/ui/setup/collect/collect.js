import { Template } from 'meteor/templating';
import { Systems } from '../../../../imports/collections/tenant/system.js';
import { Connectors } from '../../../../imports/collections/global/connector.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';

import './collect.html';

// Setup search reactive vars
var sys_search = new ReactiveVar('');
var eo_search = new ReactiveVar('');

Template.collect.onCreated(function(){
  Meteor.subscribe('systems', function (){
    console.log( "Collect - Systems now subscribed.");
  });
  Meteor.subscribe('connectors', function (){
    console.log( "Collect - Connectors now subscribed.");
  });
  Meteor.subscribe('external_objects', function (){
    console.log( "Collect - ExternalObjects now subscribed.");
  });
});

Template.collect.helpers({
  systems() {
    var ws = Session.get("currentWs");
    if(ws)
    {
      let system_search = sys_search.get();
      let extobj_search = eo_search.get();
      console.log("Sys: ",system_search, " | Eo : ", extobj_search);
      let systems = null;
      if(system_search){
        if(extobj_search){
          systems = Systems.find({"workspace_id": ws._id
          , "name": {$regex : ".*"+system_search+"*."}
          , "external_objects.name": {$regex : ".*"+extobj_search+"*.", $options: "i"}}
          , {sort: {name:1}});
        }else {
          systems = Systems.find({"workspace_id": ws._id, "name": {$regex : ".*"+system_search+"*.", $options: "i"}},{sort: {name:1}});
        }
      }
      else{
        systems = Systems.find({"workspace_id": ws._id},{sort: {name:1}});
      }
      return systems;
    }
  },
  external_objects() {
    var ws = Session.get("currentWs")
    if(ws)
    {
      return ExternalObjects.find({"workspace_id": ws._id});
    }
  },
  isValid: function(){
    var ws = Session.get("currentWs");
    if(ws){
      return Meteor.tools.connectStatus(ws._id);
    }else{
      return false;
    }
  },
  hasObject : function(){
    var ws = Session.get("currentWs");
    var has = false;
    if(ws){
      var object = ExternalObjects.find({"workspace_id": ws._id});
      if(object.count() > 0){
        has = true;
      }
    }
    return has;
  },
  hasEnoughObject : function(){
    //TODO: NEED TO VERIFY THESE ARE ALSO COLLECTED
    var ws = Session.get("currentWs");
    var hasEnough = false;
    if(ws){
      var object = ExternalObjects.find({"workspace_id": ws._id});
      if(object.count() > 1){
        hasEnough = true;
      }
    }
    return hasEnough;
  }
});

Template.collect.events({
  'click .delete' : function(){
    var errDiv = document.getElementById("addErrCollect");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    var ws = Session.get("currentWs");
    var eo = ExternalObjects.findOne(this._id);

    // BUSINESS RULE: Only allow deletion of external objects if they arent used in a Vertify Object.
    var vo_eo = VertifyObjects.find({"workspace_id": ws._id, "external_objects.external_object_id": eo._id});
    var objectCount = vo_eo.count();
    if(objectCount > 0){
      //TODO: improve with error Template
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Existing Dependencies ] You must delete any existing Vertify Objects before you can remove external objects.</li>";
    }
    else{
      Meteor.call('tasks.insert', 'deleteexternalobject', ws._id, eo._id
      , (error, result) => {
        if(error){
          //console.log(err);
          //TODO: improve with error Template
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Task " + err.error + "] " + err.reason + "</li>";
        }
        else {
          console.log('Successfully created task: deleteexternalobject');
          //TODO: Change this so elixir deletes workspace data by oplog data
          /*
          Meteor.call('external_objects.remove', this._id, ws._id
          , (err, res) => {
            if(err){
              //console.log(err);
              //TODO: improve with error Template
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ ExternalObject " + err.error + "] " + err.reason + "</li>";
            }
            else {
              // successful call
            }
          });*/
        }
      });
    }
  },
  'click .toConnect': function(){
    FlowRouter.go('/setup/connect');
  },
  'click .toMatch' : function(e){
    console.log('Collect - toMatch event clicked.');
    FlowRouter.go('/setup/match');
  },
  'keyup input' : function(e, t){
    let fieldToSearch = e.currentTarget.name;
    let searchValue = e.currentTarget.value;
    if(typeof search){
      if(fieldToSearch === 'externalobjectsearch'){
        //console.log("Search Value: ", searchValue);
        eo_search.set(searchValue);
      }
      else if(fieldToSearch === 'systemsearch'){
        //console.log("Search Value: ", searchValue);
        sys_search.set(searchValue);
      }
      else{
        //TODO throw error
      }
    }
  },
  'click .addextobj a' : function(e, t){
    //OBJECT TILE MENU
    var errDiv = document.getElementById("addErrCollect");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    var text = e.target.childNodes[4].textContent + " - " +  e.target.childNodes[1].textContent;
    var sys_id = e.target.childNodes[7].textContent;
    var name = e.target.childNodes[1].textContent;
    console.log("system id: " + sys_id + " | name: " + name);

    var ws = Session.get("currentWs");
    if(ws == null){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>No Workspace selected.</li>";
      return;
    }

    //verify that variable doesn't already exist for the system
    var obj = ExternalObjects.findOne({"name": name.trim(), "system_id": sys_id });
    if(obj == null){
      //console.log("ws._id: " + ws._id + "sys._id: " + sys_id + " obj._id: " + thisId );
      Meteor.call('external_objects.insert'
        , ws._id, sys_id, name
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
            Meteor.call('tasks.insert', "collectschema", ws._id, res
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
                Meteor.call('tasks.insert', "collect", ws._id, res
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
            Meteor.tools.artificalProgressBarLoading("collect", res);
            console.log("called artifical loading");
          }
        });
    }
    else{
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span> External Objects already exist.</li>";
    }
  },
  'click .systemsearch a' : function(e, t){
    //OBJECT TILE MENU
    var errDiv = document.getElementById("addErrCollect");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    var text = e.target.text;
    document.getElementById("systemsearch").value = text.toString().trim();
    sys_search.set(text);
  },
  'click .sysclear': function(e, t){
    let clear = '';
    document.getElementById("systemsearch").value = clear;
    sys_search.set(clear);
  },
  'click .eoclear': function(e, t){
    let clear = '';
    document.getElementById("objectlist").value = clear;
    eo_search.set(clear);
  },
});

Template.collectemptyheader.helpers({
  hasWorkspace : function(){
    if(Session.get("currentWs")){
      return true;
    }
    else {
      return false;
    }
  },
  hasSystems : function(){
    var ws = Session.get("currentWs");
    var has = false;
    if(ws) {
      var sys = Systems.find({"workspace_id": ws._id});
      if(sys.count > 0)
        has = true;
    }
    return has;
  },
});

Template.collectemptyheader.events({
  'click .toConnect': function(){
    FlowRouter.go('/setup/connect');
  }
});

Template.systemobjectmenu.helpers({
  eo_sorted(_id){
    var system = Systems.findOne(_id);
    if(system){
      var extobj_search = eo_search.get();
      if(extobj_search){
        let ext_obj = system.external_objects.filter(function(eo){
          return eo.name.toLowerCase().includes(extobj_search.toLowerCase());
        });
        return ext_obj.sort(Meteor.tools.compare);
      }
      else{
        return system.external_objects.sort(Meteor.tools.compare);
      }
    }
  },
  getSystemName : function(sys_id){
    var ws = Session.get("currentWs");
    if(ws){
      var curSys = Systems.findOne(sys_id, {"workspace_id": ws.id});
      return curSys.name;
    }
    else {
      console.log("no workspace selected");
      return "DefaultSystem";
    }
  },
  doesntAlreadyExist : function(name, sys_id){
    var extObj = ExternalObjects.findOne({"system_id": sys_id, "name": name});
    if(extObj){
      return false;
    }
    return true;
  }
});

Template.collectexternalobject.helpers({
  getSystemName : function(sys_id){
    var ws = Session.get("currentWs");
    if(ws){
      var curSys = Systems.findOne(sys_id, {"workspace_id": ws.id});
      return curSys.name;
    }
  },
  getConnectorName : function(sys_id){
    var ws = Session.get("currentWs");
    if(ws){
      var curSys = Systems.findOne(sys_id, {"workspace_id": ws.id});
      var curCon = Connectors.findOne(curSys.connector_id);
      if(curCon)
        return curCon.name;
    }
  },
  getCollectedRecords : function(record_count, percentage){
    if(percentage == 0){
      return percentage;
    }
    percentage = (percentage / 100);
    var records_collected = record_count * percentage;
    return records_collected;
  },
  timeRemaining : function(percentage){
    var time = 100 - percentage;
    return time + " seconds";
  }
});
