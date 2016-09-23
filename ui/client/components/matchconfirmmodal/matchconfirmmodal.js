import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { MatchResults } from '../../../imports/collections/workspace/match_result.js';
import { Tasks } from '../../../imports/collections/global/task.js';

Template.matchconfirmmodal.helpers({
  match_results(){
    ws = Session.get("currentWs");
    mr = Session.get("selectedMatchResultId");
    if(ws && mr){
      console.log(mr);
      return MatchResults.findOne({"workspace_id": ws.id});
    }
  },
  systemOfTruth: function(id){
    //TODO:
    return "MarketoLeadRecord";
  },
  systemOfTruthRecords: function(id){
    //TODO:
    return 100000;
  },
  getExternalObjectInfo: function(id){
    //TODO: if SoT do not return value - get SOT of this external object by id
    var sot = false;
    if(!sot){
      return "ExternalObjectname" + " - 30,000";
    }
  }
});

Template.matchconfirmmodal.events({
  'click #save': function(e) {
    e.preventDefault();
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
         FlowRouter.go('/setup/match');
         Modal.hide('matchconfirmmodal');
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
