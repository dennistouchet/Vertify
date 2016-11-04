import { Template } from 'meteor/templating';
import { Tasks } from '../../../../imports/collections/global/task.js';

import './loading.html';

Template.matchloading.helpers({
    isComplete: function(){
      var ws = Session.get("currentWs");
      if(ws){
        console.log(ws);
        var tasks = Tasks.find({"workspace_id": ws.id, "task": "match"}, {sort: { "created": -1 }, limit: 1});
        console.log("Loading - inside task check");
        console.log(tasks);
        var task = tasks.fetch()[0];
        if(task){
          console.log(task);
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
