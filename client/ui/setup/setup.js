import { Template } from 'meteor/templating';
import { Navitems } from '../../../imports/collections/navitems.js';
import './setup.html';

Template.setup.onCreated(function(){
  Meteor.subscribe('navitems', function (){
    console.log( "Setup - Navitems now subscribed");
  });
  Meteor.subscribe('systems', function (){
    console.log( "Connect - Systems now subscribed.");
  });
  Meteor.subscribe('external_objects', function(){
    console.log( "Match/Process - ExternalObjects now subscribed" );
  });
  Meteor.subscribe('vertify_objects', function (){
    console.log( "Match/Process - VertifyObjects now subscribed." );
  });
  Meteor.subscribe('vertify_properties', function (){
    console.log( "Match/Process - VertifyProperties now subscribed." );
  });
});

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
  },
});

Template.setup.events({
  'click' : function() {
      console.log("setup click event");
  },
  'click .toWorkspace': function(e){
    console.log('Setup - toWorkspace event clicked.');
    FlowRouter.go('/admin/workspaces');
  },
});

Template.navcard.helpers({
  step_status : function(name){

    if(Session.get("currentWs")){
      return Meteor.tools.setupStatus(Session.get("currentWs")._id, name);
    }
    else {
      return false;
    }
  },
});
