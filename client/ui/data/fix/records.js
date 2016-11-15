import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'
import { FixUnmatchedRecords } from '../../../../imports/collections/workspace/unmatched_record.js';

import './records.html';

Template.records.onCreated(function(){
    Meteor.subscribe('fix_unmatched_records', function(){
      console.log('Records - FixUnmatchRecords now subscribed');
    });
});

Template.records.helpers({
  taskRunning : function(){
    var ws = Session.get('currentWs');
    var id = Meteor.tools.getQueryParamByName('id');
    var vo = VertifyObjects.findOne(id);
    var running = true;
    if(ws && vo){
      var task = Tasks.findOne({workspace_id: ws._id, task: 'fixunmatched' }, { sort: { created: -1}});
      if(task){
        if(task.status === 'success'){
          running = false;
        }
      }
    }
    return running;
  },
  getVertifyObjectName: function(){
    var ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne(id);
    if(ws && vo){
      return vo.name;
    }
    return "Vertify Lead";
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

Template.taskProcessing.helpers({
  task(){
    var ws = Session.get('currentWs');
    var id = Meteor.tools.getQueryParamByName('id');
    var vo = VertifyObjects.findOne(id);
    if(ws && vo){
      return Tasks.findOne({workspace_id: ws._id, task: 'fixunmatched'}, { sort: { created: -1}});
    }
  },
});
