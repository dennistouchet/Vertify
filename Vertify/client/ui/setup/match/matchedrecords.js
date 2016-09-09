import { Template } from 'meteor/templating';

import './matchedrecords.html';

Template.matchedrecords.helpers({
});

Template.matchedrecords.events({
  'click' : function(){
    console.log("matchedrecords click event");
  },
});
