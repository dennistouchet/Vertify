import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './fix.html';

Template.fix.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      var vo = VertifyObjects.find({"workspace_id": ws._id, "analyze_status": "enabled"});
      return vo;
    }
    return null;
  },
  hasObjects: function(){
    var ws = Session.get("currentWs");
    var valid = false;
    if(ws){
      var count = VertifyObjects.find({"workspace_id": ws._id, "analyze_status": "enabled"}).count();
      if(count > 0){
        valid = true;
      }
    }
    return valid;
  },
  complete: function(){
    var ws = Session.get("currentWs");
    var complete = false;
    if(ws){
      return complete;
    }
  },
});

Template.fix.events({
  'click .voddl li a' : function(e, t){
    if(e.target.text.trim() == 'View Details'){
      Session.set("fixDetailsID", this._id);
      FlowRouter.go('/data/fix/details?id=' + this._id );
    }
    else{
      console.log(e.target.text);
    }
  },
  'click .toAnalyze': function(){
    FlowRouter.go('/data/analyze');
  }
});

Template.fixvertifyobjecttable.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      var vo = VertifyObjects.find({"workspace_id": ws._id, "analyze_status": "enabled"});
      return vo;
    }
    return null;
  },
});

Template.fixvertifyobjectrow.helpers({
  getRecordCountVo : function(id){
    var ws = Session.get("currentWs");
    var vo = VertifyObjects.findOne({"id": id, "workspace_id": ws._id});
    var eos = [];
    vo.external_objects.forEach(function(eo){
        eos.push(eo.external_object_id);
    });
    var count = 0;
    var ExtObjs = ExternalObjects.find({"id": { "$in": eos}});
    ExtObjs.forEach(function(extobj){
      count += extobj.record_count;
    });
    return count;
  },
  getRecordCountEo : function(id){
    var ws = Session.get("currentWs");
    var vo = VertifyObjects.findOne({"id": id, "workspace_id": ws._id});
    var count = 0;
    vo.external_objects.forEach(function(eo){
      if(eo.is_truth){
        var extobj = ExternalObjects.findOne({"id": eo.external_object_id, "workspace_id": ws._id});
        count = extobj.record_count;
      }
    });
    return count;
  },
  getTotalCount : function(id){
    return "0";
  },
  getMatchedCount : function(id){
    return "0";
  },
  getIssuesCount : function(id){
    return "0";
  },
  getVertifiedCount : function(id){
    return "0";
  },
  getUnmatchedCount : function(id){
     return "0";
  },
});
