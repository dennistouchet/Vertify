import { Template } from 'meteor/templating';
import { Systems } from '../../../../imports/collections/tenant/system.js';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js';

import './analyze.html';

Template.analyze.onCreated(function(){
  let self = this;
  self.autorun(function() {
    self.subscribe("vertify_objects", function(){
      console.log("Analyze - VertifyObjects now subscribed");
    });
    self.subscribe("external_objects", function(){
      console.log("Analyze - ExternalObjects now subscribed");
    });
    self.subscribe("systems", function(){
      console.log("Analyze - Systems now subscribed");
    });
    self.subscribe("tasks", function(){
      console.log("Analyze - Tasks now subscribed");
    });
  });
});

Template.analyze.helpers({
  vertify_objects(){
    var ws = Session.get('currentWs');
    if(ws){
      return VertifyObjects.find({"workspace_id": ws._id, "align": true});
    }
    return;
  },
  hasObjects: function(){
    var ws = Session.get('currentWs');
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
    var ws = Session.get('currentWs');
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
    if(e.target.text.trim() === 'Enable' || e.target.text.trim() === 'Redetect' || e.target.text.trim() === 'Disable')
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
    var ws = Session.get('currentWs');
    var vo = VertifyObjects.findOne(this._id);
    if(ws && vo){
      Meteor.call('vertify_objects.updateStatus', ws._id, vo._id, 'analyze', false,
       (err, res) => {
        if(err){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + '<li><span>Task Error: </span>[ Analyze ' + err.error + '] ' + err.reason + '</li>';
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

Template.analyzevertifyobjecttable.helpers({
  vertify_objects(){
    var ws = Session.get('currentWs');
    if(ws){
      return VertifyObjects.find({"workspace_id": ws._id, "align": true});
    }
    return;
  },
});

Template.analyzevertifyobjectrow.helpers({
  getExternalObjectName : function(eo_id){
    var ws = Session.get('currentWs');
    var eo = ExternalObjects.findOne(eo_id,{"workspace_id": ws._id});
    var sys = Systems.findOne(eo.system_id,{"workspace_id": ws._id});
    if(ws && eo && sys){
    if(eo.is_truth){
        return sys.name + "-" + eo.name + "*";
      }
      return sys.name + "-" + eo.name;
    }
  },
  getRecordCount : function(eo_id){
    var ws = Session.get('currentWs');
    var eo = ExternalObjects.findOne(eo_id,{"workspace_id": ws._id});
    if(ws && eo){
      return eo.record_count;
    }
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

Template.analyzeenabled.events({
  'click .toFix'(e){
    console.log('toFix clicked');
    FlowRouter.go('/data/fix');
  },
});
