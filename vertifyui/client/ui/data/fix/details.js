import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './details.html';

Template.details.helpers({
  vertify_object(){
    var ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    var _id = Session.get('fixDetailsID');
    //TODO: fix this to use querey param
    console.log(_id);
    if(ws){
      return VertifyObjects.findOne(_id,{"workspace_id": ws._id});
    }
  },
});

Template.details.events({
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

Template.detailsResults.helpers({
  getExternalObjectName: function(id){
    var ws = Session.get("currentWs");
    if(ws){
      var ext_obj = ExternalObjects.findOne({"workspace_id":ws._id, "id": id});
      return ext_obj.name;
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
