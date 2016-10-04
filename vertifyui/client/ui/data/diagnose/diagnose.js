import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './diagnose.html';

Template.diagnose.helpers({
  enabled: function(){
    return false;
  },
  vertify_objects(){
    return null;
  }
});

Template.diagnose.events({
  'click'(e, t){
    console.log('Diagnose click event.');
  }
});

Template.diagnoseVertifyObjects.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      //TODO: come up with solution for analyzed
      return VertifyObjects.find({"workspace_id": ws.id});
    }
    return VertifyObjects.find();
  },
});

Template.diagnoseVertifyObjectli.helpers({
  getExternalObjectName : function(eo_id){
    var ws = Session.get("currentWs");
    var eo = ExternalObjects.findOne({"id": parseInt(eo_id), "workspace_id": ws.id});
    return eo.name;
  },
});
