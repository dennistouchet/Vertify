import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './details.html';

Template.details.helpers({
  vertify_object(){
    var ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    if(ws && id){
      return VertifyObjects.findOne(id, {"workspace_id": ws.id});
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
      var ext_obj = ExternalObjects.findOne({"workspace_id":ws.id, "id": id});
      return ext_obj.name;
    }
  },
  getTotal: function(){
    //TODO calculate real values
    return "0-todo";
  },
  getMatched: function(){
    //TODO calculate real values
    return "0-todo";
  },
  getDuplicates: function(){
    //TODO calculate real values
    return "0-todo";
  },
  getUnmatched: function(){
    //TODO calculate real values
    return "0-todo";
  },
});
