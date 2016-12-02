import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './details.html';

Template.fixdetails.onCreated(function(){
  var vo_id = FlowRouter.getQueryParam("id");
  this.vo_id = new ReactiveVar(vo_id);
})

Template.fixdetails.helpers({
  vertify_object(){
    var ws = Session.get("currentWs");
    var id = Template.instance().vo_id.get();
    console.log(id);
    if(ws){
      return VertifyObjects.findOne(id,{"workspace_id": ws._id});
    }
  },
});

Template.fixdetails.events({
  'click .returnToList': function(e){
    FlowRouter.go('/data/fix');
  },
  'click .fixIssues': function(e){
    ModalHelper.openFixConfirmModalFor('issues');
  },
  'click .fixUnmatched': function(e){
    ModalHelper.openFixConfirmModalFor('unmatched');
  },
});

Template.fixdetailsresults.helpers({
  getExternalObjectName: function(eo_id){
    var ws = Session.get("currentWs");
    if(ws){
      var eo = ExternalObjects.findOne(eo_id,{"workspace_id":ws._id});
      if(eo)
        return eo.name;
    }
  },
  getTotal: function(){
    //TODO calculate real values
    return "0";
  },
  getMatched: function(){
    //TODO calculate real values
    return "0";
  },
  getDuplicates: function(){
    //TODO calculate real values
    return "0";
  },
  getUnmatched: function(){
    //TODO calculate real values
    return "0";
  },
});
