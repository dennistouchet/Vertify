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
      vo = VertifyObjects.findOne(id, {"workspace_id": ws.id});
      return vo;
    }
  },
  name: function(){
    //TODO get real values
    return "TODO NAME";
  },
  getRecords: function(){
    //TODO get real values
    return "11,265";
  },
  getSystemNames: function(){
    //TODO get real values
    return "Marketo (MK), NetSuite (NS)";
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

    id = Session.get("fixVertifyObject");
    ws = Session.get("currentWs");
    if(ws && id){
      vo = VertifyObjects.findOne(id, {"workspace_id": ws.id});

      //TODO: trigger fix task

      //modal.hide
    }
  },
});
