import { Template } from 'meteor/templating';
import { Tasks } from '../../../imports/collections/global/task.js'

import './test3.html';

Template.test3.onCreated(function(){
  Meteor.subscribe('tasks', function(){
    console.log( "Test3 - Tasks now subscribed.");
  });
});

Template.tasks.helpers({
  tasks(){
    var ws = Session.get('currentWs');
    if(ws){
      return Tasks.find({workspace_id: ws._id}, { sort: { created: -1}});
    }
  }
});
