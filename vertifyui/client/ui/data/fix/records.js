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
    var errDiv = document.getElementById("addErrRecords");
    errDiv.innerHTML = "";
    errDiv.style.display = "none";

    FlowRouter.go('/data/fix');
  },
  'click .selectAll': function(e){
    var errDiv = document.getElementById("addErrRecords");
    errDiv.innerHTML = "";
    errDiv.style.display = "none";

    errDiv.style.display = 'block';
    errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Happy Path ] Currently Select/Unselect functionality is unsupported</li>";
  },
  'click .action': function(e){
    var errDiv = document.getElementById("addErrRecords");
    errDiv.innerHTML = "";
    errDiv.style.display = "none";

    errDiv.style.display = 'block';
    errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Happy Path ] Currently Action functionality is unsupported</li>";
  },
  'click .fix': function(e){
    var errDiv = document.getElementById("addErrRecords");
    errDiv.innerHTML = "";
    errDiv.style.display = "none";

    errDiv.style.display = 'block';
    errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Happy Path ] Currently Fix functionality is unsupported</li>";
  },
  'click .export': function(e){
    var errDiv = document.getElementById("addErrRecords");
    errDiv.innerHTML = "";
    errDiv.style.display = "none";

    errDiv.style.display = 'block';
    errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Happy Path ] Currently Export functionality is unsupported</li>";
  },
  'click .addCol': function(e){
    var errDiv = document.getElementById("addErrRecords");
    errDiv.innerHTML = "";
    errDiv.style.display = "none";

    errDiv.style.display = 'block';
    errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Happy Path ] Currently Add Column functionality is unsupported</li>";
  }
});


Meteor.subscribe('fix_unmatched_records', function(){
  console.log('Connect - Tasks now subscribed');
})
