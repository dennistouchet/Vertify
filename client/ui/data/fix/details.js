import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './details.html';

Template.fixdetails.onCreated(function(){
  //ID NOT setting on first load
  var id = Meteor.tools.getQueryParamByName("id");
  console.log(id);
  this.vo_id = new ReactiveVar(id);
})

Template.fixdetails.helpers({
  vertify_object(){
    var ws = Session.get("currentWs");
    var vo_id = Template.instance().vo_id.get();
    var _id = Session.get("fixDetailsID");
    console.log(vo_id);
    if(ws){
      return VertifyObjects.findOne(_id,{"workspace_id": ws._id});
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
