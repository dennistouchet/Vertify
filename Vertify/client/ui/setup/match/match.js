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
  },
  vertifyObjectCount : function(){
    var ws = Session.get("currentWs");
    if(ws == null){
      return false;
    }

    var count = VertifyObjects.find({"workspace_id": ws.id}).count();
    if(count > 0)
    {
      return count.toString() + " objects";
    }
    return "0 objects";
  },
  matchCompleted : function(){
    var ws = Session.get("currentWs");
    if(ws == null){
      return false;
    }

    var voApproved = VertifyObjects.find({"workspace_id": ws.id, "external_objects.approved": true});
    console.log("vo approved: ");
    console.log(voApproved);
    var count = VertifyObjects.find({"workspace_id": ws.id, "external_objects.approved": true}).count();
    if(count > 0)
    {

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
    console.log("dropdown event clicked:");
    console.log(e.target);
    if(e.target.text.trim() == 'Match'){
      FlowRouter.go('/setup/match/process');
    }
    else{
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
  'click .returnToList' : function(e){
    console.log('Match - returnToList event clicked.');
    FlowRouter.go('/setup/match');
  },
  'click .viewMatchRecords' : function(e){
    console.log('Match - viewMatchRecords event clicked.');
    //FlowRouter.go('/setup/collect');
  },
  'click .editMatchRules' : function(e){
    console.log('Match - editMatchRules event clicked.');
    //FlowRouter.go('/setup/collect');
  },
  'click .acceptMatchModal' : function(e){
      e.preventDefault();

      ModalHelper.openMatchConfirmModalFor();

      console.log("Match - complete match modal clicked");
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
