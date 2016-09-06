import { Template } from 'meteor/templating';
import { MatchReults } from '../../../imports/collections/tenant/system.js';
import { Tasks } from '../../../imports/collections/global/task.js';

Template.matchconfirmmodal.helpers({
});

Template.matchconfirmmodal.events({
  'click' : function(e, template){
     console.log("matchconfirmmodal click event");
  },
});

Meteor.subscribe("match_results", function (){
  console.log( "Matchconfirmmodal - MatchResults now subscribed.");
});


Meteor.subscribe("tasks", function (){
  console.log( "Matchconfirmmodal - Tasks now subscribed.");
});
