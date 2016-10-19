import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../imports/collections/tenant/vertify_property.js';
import { Tasks } from '../../../imports/collections/global/task.js';

import './analyzeconfirmmodal.html';

Template.analyzeconfirmmodal.helpers({
  vertify_object(){
    id = Session.get("analyzeVertifyObject");
    ws = Session.get("currentWs");
    if(ws && id){
      vo = VertifyObjects.findOne(id, {"workspace_id": ws.id});
      return vo;
    }
  },
});

Template.analyzeconfirmmodal.events({
  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("addErrModal");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    id = Session.get("analyzeVertifyObject");
    ws = Session.get("currentWs");
    if(ws && id){
      vo = VertifyObjects.findOne(id, {"workspace_id": ws.id});

      Meteor.call('tasks.insert', "analyze", ws.id, vo.id
      , (error, result) => {
        if(error){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ Analyze " + error.error + "] " + error.reason + "</li>";
          //return false;
          return;
        }
        else {
         //success
         //TODO: mock update vertify object analyze status
         Meteor.tools.artificalProgressBarLoading("analyze", vo.id);
         console.log("called artifical loading");

         FlowRouter.go('/data/analyze');
         Modal.hide('analyzeconfirmmodal');
       }
      });
    }
  },
});
