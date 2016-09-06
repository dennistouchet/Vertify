import { Template } from 'meteor/templating';

import './matchresults.html';

Template.matchresults.helpers({
});

Template.matchresults.events({
  'click' : function(){
    console.log("matchresults click event");
  },
});
