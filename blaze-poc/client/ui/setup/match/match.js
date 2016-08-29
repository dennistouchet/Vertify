import { Template } from 'meteor/templating';
import { Workspaces } from '../../../../imports/collections/tenant/workspace.js';
import { Systems } from '../../../../imports/collections/tenant/system.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';

Template.match.helpers({
  hasWorkspace: function(){
    var ws = Session.get("currentWs");
    if(ws == null){
      console.log("Match - No workspace selected");
      return "No Workspace selected.";
    }
    else{
      console.log("Match - current workspace: " + ws.name);
      return ws.name;
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
  hasVertifyObjects : function(){
    var ws = Session.get("currentWs");
    if(ws == null){
      return false;
    }

    var count = VertifyObjects.find({"workspace_id": ws.id}).count();
    if(count > 0)
    {
      return true;
    }
    return false;
  }
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
