import { Template } from 'meteor/templating';
import { Tasks } from '../../../../imports/collections/global/task.js';

import './loading.html';

Template.matchloading.helpers({
    task(){
      var ws = Session.get("currentWs");
      if(ws){
        //TODO add vertify object
        var task = Tasks.findOne({"workspace_id": ws._id, "task": "match"}, {sort: { "created": -1 }, limit: 1});
        return task;
      }
    },
    isComplete: function(){
      var ws = Session.get("currentWs");
      if(ws){
        //TODO add vertify object
        var tasks = Tasks.find({"workspace_id": ws._id, "task": "match"}, {sort: { "created": -1 }, limit: 1});
        var task = tasks.fetch()[0];
        if(task){
          if(task.status == "success" || task.status == "terminated" || task.status == "failed"){
            FlowRouter.go('/setup/match');
          }
          return false;
        }
        else{
          return true;
        }
      }
    },
});

Template.matchloading.events({
  'click .toMatch': function(e){
    console.log('Loading - toMatch clicked');
    FlowRouter.go('/setup/match/');
  }
})
