import { Template } from 'meteor/templating';

import './test2.html';

Template.test2.helpers({
  kvp() {
    var kvpairs = [];

    Object.keys(Session.keys).forEach( function(k){
      kvpairs.push({
        key: k,
        value: Session.get(k)
      })
    });

    return kvpairs;
  },
});

Template.test2.events({

  'click .myAlert' : function(e){
      e.preventDefault();
      var hd = "hotdog";
      console.log("My val: " + hd);
      var val = Meteor.tools.myAlert(hd);
      console.log("Return val: " + val);
  },
});
