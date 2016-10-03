import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { AlignResults } from '../../../imports/collections/workspace/align_result.js';
import { Tasks } from '../../../imports/collections/global/task.js';

import './alignconfirmmodal.html';

Template.alignconfirmmodal.helpers({
  align_results(){
    ws = Session.get("currentWs");
    ar = Session.get("selectedAlignResultId");
    if(ws && ar){
      console.log(mr);
      return AlignResults.findOne({"workspace_id": ws.id});
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
         FlowRouter.go('/setup/align');
         Modal.hide('alignconfirmmodal');
       }
      });
    }
  },
});


Meteor.subscribe("align_result", function (){
  console.log( "Aligncomfirmmodal - AlignResults now subscribed.");
});


Meteor.subscribe("tasks", function (){
  console.log( "Aligncomfirmmodal - Tasks now subscribed.");
});
