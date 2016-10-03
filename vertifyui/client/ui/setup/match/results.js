import { Template } from 'meteor/templating';

import './results.html';

Template.matchresults.helpers({
});

Template.matchresults.events({
  'click' : function(){
    console.log("match results click event");
  },
});
