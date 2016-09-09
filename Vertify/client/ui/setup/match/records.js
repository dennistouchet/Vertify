import { Template } from 'meteor/templating';

import './records.html';

Template.records.helpers({
});

Template.records.events({
  'click' : function(){
    console.log("records click event");
  },
});
