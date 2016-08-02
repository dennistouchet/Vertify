import { Template } from 'meteor/templating';
import { Navitems } from '../../../imports/collections/navitems.js';
import './setup.html';

Template.setup.helpers({
  navitems() {
    return Navitems.find({});
  },
  getWorkspace : function(){
    if(Session.get("currentWs")){
      return Session.get("currentWs").name;
    }
    else {
      return "No Workspace Selected.";
    }
  },
  hasWorkspace : function(){
    if(Session.get("currentWs")){
      return true;
    }
    else {
      return false;
    }
  },
  isSetup : function(name){
    //alert('inside isname function' + name);
    if(name === 'Setup'){
      return true;
    }
    else {
      return false;
    }
  }
});

Template.setup.events({
  'click' : function() {
      console.log("setup click event");
  }
});

Meteor.subscribe('navitems', function (){
  console.log( "Setup - Navitems now subscribed");
});
