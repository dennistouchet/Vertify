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
  isEnable: function(){
    var action = Session.get("analyzeAction");
    isEnabled = false;
    if(action == "Enable"){
      isEnabled = true;
    }
    return isEnabled;
  },
  isRedetect: function(){
    var action = Session.get("analyzeAction");
    isRedetect = false;
    if(action == "Redetect"){
      isRedetect = true;
    }
    return isRedetect;
  },
  getTask : function(){
    return Session.get("analyzeAction");
  }
});

Template.analyzeconfirmmodal.events({
  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("addErrModal");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    var id = Session.get("analyzeVertifyObject");
    var ws = Session.get("currentWs");
    var vo = VertifyObjects.findOne(id, {"workspace_id": ws.id});
    var action = Session.get("analyzeAction");
    if(ws && vo){
      if(action == "Enable" || action == "Redetect"){
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
           //Meteor.tools.artificalProgressBarLoading('analyze', vo.id);
           //console.log("called artifical loading");

           FlowRouter.go('/data/analyze');
           Modal.hide('analyzeconfirmmodal');
         }
        });
      }
      else if(action == "Disable"){
        Meteor.call('vertify_objects.updateStatus', ws.id, vo.id, 'analyze', false
        , (err, res) => {
          if(err){
            //console.log(err);
            errDiv.style.display = 'block';
            errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ Analyze " + err.error + "] " + err.reason + "</li>";
            //return false;
            return;
          }
          else {
           //success
           FlowRouter.go('/data/analyze');
           Modal.hide('analyzeconfirmmodal');
         }
        });
      }
    }
  },
});
