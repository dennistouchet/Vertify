import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { MatchResults } from '../../../imports/collections/workspace/match_result.js';
import { Tasks } from '../../../imports/collections/global/task.js';

import './alignconfirmmodal.html';

Template.alignconfirmmodal.helpers({
  align_results(){
    ws = Session.get("currentWs");
    mr = Session.get("selectedAlignResultId");
    if(ws && mr){
      console.log(mr);
      return MatchResults.findOne({"workspace_id": ws.id});
    }
  },
  fieldCount: function(id){
    //TODO:
    return 52;
  },
});

Template.alignconfirmmodal.events({
  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("addErrModal");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    id = Session.get("selectedVertifyObject");
    vo = VertifyObjects.findOne(id);
    ws = Session.get("currentWs");
    if(ws && vo){
      Meteor.call('tasks.insert', "align", ws.id, vo.id
      , (error, result) => {
        if(error){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ Align " + error.error + "] " + error.reason + "</li>";
          //return false;
          return;
        }
        else {
         //success
         var status = "approved";
         //TODO: update vertify property
         //TODO: this method will eventually be removed and called by elixir
       }
      });
    }
  },
});


Meteor.subscribe("match_results", function (){
  console.log( "aligncomfirmmodal - MatchResults now subscribed.");
});


Meteor.subscribe("tasks", function (){
  console.log( "aligncomfirmmodal - Tasks now subscribed.");
});
