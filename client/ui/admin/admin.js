import { Template } from 'meteor/templating';
import { Navitems } from '../../../imports/collections/navitems.js';
import './admin.html';

Template.admin.onCreated(function(){
  Meteor.subscribe('navitems', function (){
    console.log( "Admin - Navitems now subscribed");
  });
});

Template.admin.helpers({
  navitems() {
    return Navitems.find({});
  },
  isAdmin : function(name){
    //alert('inside isname function: ' + name);
    if(name === 'Admin'){
      return true;
    }
    else {
      return false;
    }
  }
});

Template.admin.events({
  'click' : function() {
      console.log("admin click event");
  }
});
