import { Template } from 'meteor/templating';
import { Workspaces } from '../../../../imports/collections/tenant/workspace.js';
import { Systems } from '../../../../imports/collections/tenant/system.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js';

import './match.html';

Template.match.onCreated(function(){
  Meteor.subscribe('systems', function (){
    console.log( "Match - Systems now subscribed.");
  });

  Meteor.subscribe('external_objects', function (){
    console.log( "Match - ExternalObjects now subscribed.");
  });

  Meteor.subscribe('vertify_objects', function (){
    console.log( "Match - VertifyObjects now subscribed." );
  });

  Meteor.subscribe('vertify_properties', function (){
    console.log( "Match - VertifyProperties now subscribed." );
  });
});

Template.match.helpers({
  isValid: function(){
    var ws = Session.get("currentWs");
    if(ws){
      return Meteor.tools.collectStatus(ws._id);
    }else{
      return false;
    }
  },
  hasWorkspace: function(){
    var ws = Session.get("currentWs");
    if(ws){
      console.log("Match - current workspace: " + ws.name);
      return ws.name;
    }
    console.log("Match - No workspace selected");
    return "No Workspace selected.";
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
  hasEnoughObject : function(){
    var ws = Session.get("currentWs");
    var has = false;
    if(ws) {
      var count = ExternalObjects.find({"workspace_id": ws._id}).count;
      if(count > 0)
        has = true;
    }
    return has;
  },
  hasVertifyObjects : function(){
    var ws = Session.get("currentWs");
    if(ws){
    var count = VertifyObjects.find({"workspace_id": ws._id}).count();
    if(count > 0)
      return true;
    }
    return false;
  },
  vertifyObjectCount : function(){
    var ws = Session.get("currentWs");
    if(ws){
      var count = VertifyObjects.find({"workspace_id": ws._id}).count();
      return count.toString() + " objects";
    }
    return false;
  },
  matchCompleted : function(){
    var ws = Session.get("currentWs");
    if(ws){
      var count = VertifyObjects.find({"workspace_id": ws._id, "match": true}).count();
      if(count > 0)
        return true;
    }
    return false;
  },
});

Template.match.events({
  'click .addCustom' : function(e){
      e.preventDefault();
      console.log('Match - addCustom event clicked.');
      FlowRouter.go('/setup/match/vertifywizard');
  },
  'click .voddl li a' : function(e, t){
    var errDiv = document.getElementById("addErrMatch");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors
    var ws = Session.get("currentWs");

    if(e.target.text.trim() == 'Match')
    {
      FlowRouter.go('/setup/match/process?id=' + this._id);
    }
    else if(e.target.text.trim() == 'Edit')
    {
      //TODO: edit VO functionality
    }
    else if(e.target.text.trim() == 'Add Object')
    {
      console.log('Match - Add Object dropdown value clicked');
      FlowRouter.go('/setup/match/vertifywizard');
    }
    else if(e.target.text.trim() == 'Delete')
    {
      var vo = VertifyObjects.findOne(this._id);
      var count = VertifyProperties.find({"workspace_id": ws._id, "vertify_object_id": vo._id}).count();

      if(count > 0){
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Existing Dependencies ] Must delete all Vertify Properties before deleting a Vertify Object. </li>";
      }
      else{
      Meteor.call('tasks.insert', 'deletevertifyobject', ws._id, vo._id
      , (err, res) => {
        if(err){
          //console.log(err);
          //TODO: improve with error Template
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Task " + err.error + "] " + err.reason + "</li>";
        }else{
          console.log("Task deletevertifyobject called");
          //success
          //TODO This should be done and elixir monitors and dleetes data
          /*
          Meteor.call('vertify_objects.remove', ws._id, this._id
          , (error, result) => {
            if(error){
              //console.log(err);
              //TODO: T
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + error.error + "] " + error.reason + "</li>";
            }else{
              //success
              //TODO Need a call to remove
              //all Vertify Properties associate with this VO
            }
          });
          */
          }
        });
      }
    }
    else
    {
      console.log(e.target.text);
    }
  },
  'click .toCollect': function(e){
    FlowRouter.go('/setup/collect');
  }
});

Template.matchcomplete.events({
  'click .toAlign': function(e){
    FlowRouter.go('/setup/align');
  }
});

Template.matchvertifyobjecttable.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      return VertifyObjects.find({"workspace_id": ws._id});
    }
    return null;
  },
  external_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      return ExternalObjects.find({"workspace_id": ws._id});
    }
    return null;
  },
});

Template.matchvertifyobjectrow.helpers({
  getExternalObjectName : function(eo_id){
    var ws = Session.get("currentWs");
    var eo = ExternalObjects.findOne({"id": parseInt(eo_id), "workspace_id": ws._id});
    var sys = Systems.findOne({"workspace_id": ws._id, "id": eo.system_id});
    return sys.name + "-" + eo.name;
  },
  getExternalObjectRecords : function(eo_id){
    var ws = Session.get("currentWs");
    var eo = ExternalObjects.findOne({"id": parseInt(eo_id), "workspace_id": ws._id});
    return eo.record_count;
  },
});
