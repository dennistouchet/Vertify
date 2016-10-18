import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './details.html';

Template.details.helpers({
  getVertifyObjectName: function(){
    return "todo name";
  },
  totalAlignRecords: function(){
    //TODO calculate real values
    return "30,000";
  },
  unalignedRecords: function(){
    //TODO calculate real values
    return "11,250";
  },
  unmatchedRecords: function(){
    //TODO calculate real values
    return "18,052";
  },
});

Template.details.events({
  'click .returnToList': function(e){
    FlowRouter.go('/data/fix');
  },
  'click .fixIssues': function(e){
    ModalHelper.openFixConfirmModalFor('issues', this._id);
  },
  'click .fixUnmatched': function(e){
    ModalHelper.openFixConfirmModalFor('unmatched', this._id);
  },
});

Template.detailsResults.helpers({
  getVertifyObjectName: function(){
    return "todo name";
  },
});
