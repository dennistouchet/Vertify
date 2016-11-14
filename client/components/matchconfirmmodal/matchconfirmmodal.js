import { Template } from 'meteor/templating';
import { ExternalObjects } from '../../../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { MatchResults } from '../../../imports/collections/workspace/match_result.js';
import { Tasks } from '../../../imports/collections/global/task.js';

Template.matchconfirmmodal.onCreated(function(){
  Meteor.subscribe("match_results", function (){
    console.log( "Matchconfirmmodal - MatchResults now subscribed.");
  });
  Meteor.subscribe("vertify_objects", function (){
    console.log( "Matchconfirmmodal - VertifyObjects now subscribed.");
  });
  Meteor.subscribe("tasks", function (){
    console.log( "Matchconfirmmodal - Tasks now subscribed.");
  });
});

Template.matchconfirmmodal.helpers({
  vertify_object(){
    var vo_id = Session.get("selectedVertifyObject");
    return VertifyObjects.findOne(vo_id);
  },
  match_results(){
    ws = Session.get("currentWs");
    if(ws){
      return MatchResults.findOne({"workspace_id": ws._id});
    }
  },
  systemOfTruth: function(id){
    ws = Session.get("currentWs");
    var sot = "No SOT";
    if(ws ){
      var MR = MatchResults.findOne({"workspace_id": ws._id});
      MR.external_objects.forEach(function(eo){
        if(eo.is_truth)
        {
          console.log(eo);
          //TODO: adjust this to use workspace once real match results are being sent
          sot = ExternalObjects.findOne({"id": eo.external_object_id}).name;//, "workspace_id":ws._id}).name;
        }
      });
    }
    return sot;
  },
  systemOfTruthRecords: function(id){
    ws = Session.get("currentWs");
    var sot = "No Records found";
    if(ws ){
      var MR = MatchResults.findOne({"workspace_id": ws._id});
      MR.external_objects.forEach(function(eo){
        if(eo.is_truth)
        {
          sot = eo.total;
        }
      });
    }
    return sot;
  },
  getExternalObjectInfo: function(id){
    ws = Session.get("currentWs");
    var sot = "External object error";
    if(ws){
      var MR = MatchResults.findOne({"workspace_id": ws._id});
      MR.external_objects.forEach(function(eo){
        if(!eo.is_truth)
        {
          //TODO: adjust this to use workspace once real match results are being sent
          sot = ExternalObjects.findOne({"id": eo.external_object_id}).name;//, "workspace_id":ws._id}).name;
          sot += ": " + eo.total + " records.";
        }
      });
    }
    return sot;
  },
  getExternalObjectName: function(id){
    var ws = Session.get("currentWs");
    if(ws){
      return ExternalObjects.findOne({"id": id, "workspace_id": ws._id}).name;
    }
  }
});

Template.matchconfirmmodal.events({
  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("addErrModal");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    id = Session.get("selectedVertifyObject");
    vo = VertifyObjects.findOne(id);
    ws = Session.get("currentWs");
    if(ws && vo){

      Meteor.tools.updateVertifyObjectStatus(ws._id, vo.id, 'match', false);
      
      Meteor.call('tasks.insert', "match", ws._id, vo.id
      , (error, result) => {
        if(error){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ Match " + error.error + "] " + error.reason + "</li>";
          return;
        }
        else {
         //success
         //TODO: this method needs to be removed and called by elixir
         var status = "approved";
         Meteor.call('vertify_objects.updateApprovedStatus', id, ws._id, status
           , (error, result) => {
             if(error){
               //console.log(err);
               errDiv.style.display = 'block';
               errDiv.innerHTML = errDiv.innerHTML + "<li><span>Update Error: </span>[ Match " + error.error + "] " + error.reason + "</li>";
               return;
             }
             else {

               FlowRouter.go('/setup/match/loading');
               Modal.hide('matchconfirmmodal');
             }
         });
       }
      });
    }
  },
});
