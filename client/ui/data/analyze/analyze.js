import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './analyze.html';

Template.analyze.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      return VertifyObjects.find({"workspace_id": ws._id, "align": true});
    }
    return null;
  },
  hasObjects: function(){
    var ws = Session.get("currentWs");
    var valid = false;
    if(ws){
      var count = VertifyObjects.find({"workspace_id": ws._id, "align": true}).count();
      if(count > 0){
        valid = true;
      }
    }
    return valid;
  },
  isEnabled: function(){
    var ws = Session.get("currentWs");
    var enabled = false;
    if(ws){
      var vos = null;
      vos = VertifyObjects.find({"workspace_id": ws._id, "align": true});
      vos.forEach(function(vo){
        if(vo.analyze_status == "enabled"){
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
    if(e.target.text.trim() == 'Enable'
      || e.target.text.trim() == 'Redetect'
      || e.target.text.trim() == 'Disable')
    {
      ModalHelper.openAnalysisConfirmModalFor(this._id, e.target.text.trim());
    }
    else{
      //TODO: Throw error?
      console.log(e.target.text);
    }
  },
  'click .cancelAnalyze' : function(e){
    console.log("Cancel Analyze called");
    var ws = Session.get("currentWs");
    var vo = VertifyObjects.findOne(this._id);
    if(ws && vo){
      Meteor.call('vertify_objects.updateStatus', ws._id, vo.id, 'analyze', false
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
        //console.log("successfully update Vertify Object Analyze status");
       }
      });
    }
  },
  'click .toAlign'(e){
    console.log('toAlign clicked');
    FlowRouter.go('/setup/Align');
  },
});

Template.analyzeVertifyObjects.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      return VertifyObjects.find({"workspace_id": ws._id, "align": true});
    }
    return null;
  },
});

Template.analyzeVertifyObjectli.helpers({
  getExternalObjectName : function(eo_id){
    var ws = Session.get("currentWs");
    var eo = ExternalObjects.findOne({"id": parseInt(eo_id), "workspace_id": ws._id});
    if(eo.is_truth){
      return eo.name + "*";
    }
    return eo.name;
  },
  getRecordCount : function(eo_id){
    var ws = Session.get("currentWs");
    var eo = ExternalObjects.findOne({"id": parseInt(eo_id), "workspace_id": ws._id});
    return eo.record_count;
  },
  isAnalyzing(status){
    if(status == "analyzing") return true;

    return false;
  },
  isEnabled(status){
    if(status == "enabled") return true;

    return false;
  }
});

Template.analyzeEnabled.events({
  'click .toFix'(e){
    console.log('toFix clicked');
    FlowRouter.go('/data/fix');
  },
})
