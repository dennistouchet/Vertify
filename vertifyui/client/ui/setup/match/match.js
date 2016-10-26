import { Template } from 'meteor/templating';
import { Workspaces } from '../../../../imports/collections/tenant/workspace.js';
import { Systems } from '../../../../imports/collections/tenant/system.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';

import './match.html';

Template.match.helpers({
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
    if(Session.get("systemCount")){
      var sysCnt = parseInt(Session.get("systemCount"));
      if(sysCnt > 0){
        return true;
      }
    }
      return false;
  },
  hasEnoughObject : function(){
    if(Session.get("objectCount"))
    {
      var objectcount =  parseInt(Session.get("objectCount"));
      if(objectcount > 1){
        return true;
      }
    }
    return false;

  },
  hasVertifyObjects : function(){
    var ws = Session.get("currentWs");
    if(ws){
    var count = VertifyObjects.find({"workspace_id": ws.id}).count();
    if(count > 0)
      return true;
    }
    return false;
  },
  vertifyObjectCount : function(){
    var ws = Session.get("currentWs");
    if(ws){
      var count = VertifyObjects.find({"workspace_id": ws.id}).count();
      return count.toString() + " objects";
    }
    return false;
  },
  matchCompleted : function(){
    var ws = Session.get("currentWs");
    if(ws){
      var voApproved = VertifyObjects.find({"workspace_id": ws.id, "external_objects.approved": true});
      var count = VertifyObjects.find({"workspace_id": ws.id, "external_objects.approved": true}).count();
      if(count > 0)
        return true;
    }
    return false;
  },
});

Template.matchVertifyObjects.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      return VertifyObjects.find({"workspace_id": ws.id});
    }
    return null;
  },
  external_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      return ExternalObjects.find({"workspace_id": ws.id});
    }
    return null;
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
      Meteor.call('vertify_objects.remove', ws.id, this._id
      , (err, res) => {
        if(err){
          //console.log(err);
          //TODO: improve with error Template
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
        }else{
          //success
          //TODO Need a call to remove
          //all Vertify Properties associate with this VO
        }
      });
    }
    else
    {
      console.log(e.target.text);
    }
  },
});

Template.matchVertifyObjectli.helpers({
  getExternalObjectName : function(eo_id){
    var ws = Session.get("currentWs");
    var eo = ExternalObjects.findOne({"id": parseInt(eo_id), "workspace_id": ws.id});
    return eo.name;
  },
  getExternalObjectRecords : function(eo_id){
    var ws = Session.get("currentWs");
    var eo = ExternalObjects.findOne({"id": parseInt(eo_id), "workspace_id": ws.id});
    return eo.record_count;
  },
});

Template.matchCompleteFooter.events({
  'click .toAlign': function(e){
    FlowRouter.go('/setup/align');
  }
});

Meteor.subscribe('workspaces', function (){
  console.log( "Match - Workspaces now subscribed.");
});

Meteor.subscribe('systems', function (){
  console.log( "Match - Systems now subscribed.");
});

Meteor.subscribe('external_objects', function (){
  console.log( "Match - ExternalObjects now subscribed.");
});

Meteor.subscribe('vertify_objects', function (){
  console.log( "Match - VertifyObjects now subscribed." );
});
