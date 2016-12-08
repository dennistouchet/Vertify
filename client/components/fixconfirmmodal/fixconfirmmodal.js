import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../imports/collections/tenant/vertify_property.js';
import { ExternalObjects } from '../../../imports/collections/tenant/external_object.js';

import './fixconfirmmodal.html';

Template.fixconfirmmodal.onCreated(function(){
  var vo_id = Meteor.tools.getQueryParamByName("id");
  this.vo_id = new ReactiveVar(vo_id);
  console.log(this.vo_id);
});

Template.fixconfirmmodal.helpers({
  vertify_object(){
    ws = Session.get("currentWs");
    var vo_id = Template.instance().vo_id.get();
    console.log(vo_id);
    if(ws && vo_id){
      vo = VertifyObjects.findOne(vo_id, {"workspace_id": ws._id});
      if(vo)
        return vo;
    }
  },
  getRecords: function(vo_id){
    ws = Session.get("currentWs");
    if(ws && vo_id){
      vo = VertifyObjects.findOne(vo_id, {"workspace_id": ws._id});
      if(vo){
        var record_count = 0;
        vo.external_objects.forEach(function(eo){
          record_count += eo.record_count;
        });
        return record_count;
      }
    }
  },
  getSystemNames: function(eo_id){
    ws = Session.get("currentWs");
    if(ws && eo_id){
      eo = ExternalObjects.findOne(eo_id, {"workspace_id": ws._id});
      if(eo)
        return eo.name;
    }
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
      vo = VertifyObjects.findOne(vo._id,{"workspace_id": ws._id});
      var type = Session.get("fixType");
      console.log("ws: " + ws);
      console.log("vo: " + vo);
      console.log("fixtype: " + type);
      if(type == "issues"){
        Meteor.call('tasks.insert', "fixissues", ws._id, vo._id
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
        Meteor.call('tasks.insert', "fixunmatched", ws._id, vo._id
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
    errDiv.style.display = 'block';
    errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error missing vo or id</li>";
  },
});
