import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './analyze.html';

Template.analyze.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      //TODO: come up with solution for analyzed
      return VertifyObjects.find({"workspace_id": ws.id, "align": true});
    }
    //return VertifyObjects.find();
    return null;
  },
  hasObjects: function(){
    var ws = Session.get("currentWs");
    var valid = false;
    if(ws){
      var count = VertifyObjects.find({"workspace_id": ws.id, "align": true}).count();
      if(count > 0){
        valid = true;
      }
    }
    return valid;
  },
  enabled: function(){
    var ws = Session.get("currentWs");
    var enabled = false;
    if(ws){
      var vos = null;
      vos = VertifyObjects.find({"workspace_id": ws.id, "align": true});
      vos.forEach(function(vo){
        if(vo.analyze_status == "Enabled"){
          enabled = true;
        }
      });
    }
    return enabled;
  },
});

Template.analyze.events({
  'click'(e, t){
    console.log('Analyze click event.');
  },
  'click .voddl li a' : function(e, t){
    if(e.target.text.trim() == 'Enable'){
      ModalHelper.openAnalysisConfirmModalFor(this._id);
    }
    else{
      console.log(e.target.text);
    }
  }
});

Template.analyzeVertifyObjects.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      //TODO: come up with solution for analyzed
      return VertifyObjects.find({"workspace_id": ws.id, "align": true});
    }
    //return VertifyObjects.find();
    return null;
  },
});

Template.analyzeVertifyObjectli.helpers({
  getExternalObjectName : function(eo_id){
    var ws = Session.get("currentWs");
    var eo = ExternalObjects.findOne({"id": parseInt(eo_id), "workspace_id": ws.id});
    if(eo.is_truth){
      return eo.name + "*";
    }
    return eo.name;
  },
  getRecordCount : function(eo_id){
    var ws = Session.get("currentWs");
    var eo = ExternalObjects.findOne({"id": parseInt(eo_id), "workspace_id": ws.id});
    return eo.record_count;
  },
  isAnalyzing(status){
    if(status == "Analyzing") return true;

    return false;
  },
  isEnabled(status){
    if(status == "Enabled") return true;

    return false;
  }
});

Template.analyzeEnabled.events({
  'click .toFix'(e){
    console.log('toFix clicked');
    FlowRouter.go('/data/fix');
  },
})
