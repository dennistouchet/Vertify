import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../imports/collections/tenant/vertify_property.js';
import { Tasks } from '../../../imports/collections/global/task.js';

import './fixconfirmmodal.html';

Template.fixconfirmmodal.helpers({
  vertify_object(){
    id = Session.get("fixVertifyObject");
    ws = Session.get("currentWs");
    if(ws && id){
      vo = VertifyObjects.findOne(id, {"workspace_id": ws._id});
      return vo;
    }
  },
  name: function(){
    //TODO get real values
    return "TODO NAME";
  },
  getRecords: function(){
    //TODO get real values
    return "0 - TODO";
  },
  getSystemNames: function(){
    //TODO get real values
    return "Marketo (MK), NetSuite (NS) - TODO";
  },
  getActionDescription: function(){
    var type = Session.get("fixType");
    if(type == "issues"){
      return "Update values to system of truth";
    }else if(type == "unmatched"){
      return "Add missing records to system";
    }
  }
});

Template.fixconfirmmodal.events({
  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("addErrModal");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    var id = Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne(id);
    ws = Session.get("currentWs");
    if(ws && vo){
      vo = VertifyObjects.findOne({"workspace_id": ws._id, "id": vo.id});
      var type = Session.get("fixType");
      console.log("Workspace | VO | fixtype");
      console.log(ws);
      console.log(vo);
      console.log(type);
      if(type == "issues"){
        Meteor.call('tasks.insert', "fixissues", ws._id, vo.id
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
           FlowRouter.go('/data/fix/records?id=' + id);
           Modal.hide('fixconfirmmodal');
         }
        });
      }else if(type == "unmatched"){
        Meteor.call('tasks.insert', "fixunmatched", ws._id, vo.id
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
           FlowRouter.go('/data/fix/records?id=' + id);
           Modal.hide('fixconfirmmodal');
         }
        });
      }else{
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ Fix " + type + " unknown ] unrecognized task type</li>";
      }

    }
  },
});
