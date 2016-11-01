import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'
import { FixUnmatchedRecords } from '../../../../imports/collections/workspace/unmatched_record.js';

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


Meteor.subscribe('fix_unmatched_records', function(){
  console.log('Connect - Tasks now subscribed');
})
