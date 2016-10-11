import { Template } from 'meteor/templating';
import { ExternalObjects } from '../../../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { MatchResults } from '../../../imports/collections/workspace/match_result.js';
import { Tasks } from '../../../imports/collections/global/task.js';

Template.matchconfirmmodal.helpers({
  match_results(){
    ws = Session.get("currentWs");
    mr = Session.get("selectedMatchResultId");
    if(ws && mr){
      console.log(mr);
      return MatchResults.findOne({"id":mr, "workspace_id": ws.id});
    }
  },
  systemOfTruth: function(id){
    ws = Session.get("currentWs");
    mr = Session.get("selectedMatchResultId");
    var sot = "No SOT";
    if(ws && mr){
      var MR = MatchResults.findOne({"id":mr, "workspace_id": ws.id});
      MR.external_objects.forEach(function(eo){
        if(eo.is_truth)
        {
          console.log(eo);
          sot = ExternalObjects.findOne({"id": eo.external_object_id, "workspace_id":ws.id}).name;
        }
      });
    }
    return sot;
  },
  systemOfTruthRecords: function(id){
    ws = Session.get("currentWs");
    mr = Session.get("selectedMatchResultId");
    var sot = "No Records found";
    if(ws && mr){
      var MR = MatchResults.findOne({"id":mr, "workspace_id": ws.id});
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
    //TODO: if SoT do not return value - get SOT of this external object by id
    ws = Session.get("currentWs");
    mr = Session.get("selectedMatchResultId");
    var sot = "External object error";
    if(ws && mr){
      var MR = MatchResults.findOne({"id":mr, "workspace_id": ws.id});
      MR.external_objects.forEach(function(eo){
        if(!eo.is_truth)
        {
          sot = ExternalObjects.findOne({"id": eo.external_object_id, "workspace_id":ws.id}).name;
          sot += ": " + eo.total + " records.";
        }
      });
    }
    return sot;
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
      Meteor.call('tasks.insert', "match", ws.id, vo.id
      , (error, result) => {
        if(error){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ Match " + error.error + "] " + error.reason + "</li>";
          //return false;
          return;
        }
        else {
         //success
         //TODO: this method needs to be removed and called by elixir
         var status = "approved";
         Meteor.call('vertify_objects.updateApprovedStatus', id, ws.id, status
           , (error, result) => {
             if(error){
               //console.log(err);
               errDiv.style.display = 'block';
               errDiv.innerHTML = errDiv.innerHTML + "<li><span>Update Error: </span>[ Match " + error.error + "] " + error.reason + "</li>";
               //return false;
               return;
             }
             else {
               FlowRouter.go('/setup/match');
               Modal.hide('matchconfirmmodal');
             }
         });
       }
      });
    }
  },
});

Meteor.subscribe("match_results", function (){
  console.log( "Matchconfirmmodal - MatchResults now subscribed.");
});


Meteor.subscribe("tasks", function (){
  console.log( "Matchconfirmmodal - Tasks now subscribed.");
});
