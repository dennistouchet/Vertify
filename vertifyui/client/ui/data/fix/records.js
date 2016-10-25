import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './records.html';

Template.records.helpers({
  getVertifyObjectName: function(){
    return "todo name";
  },
});

Template.records.events({
  'click .returnToSummary': function(e){
    FlowRouter.go('/data/fix');
  },
});
