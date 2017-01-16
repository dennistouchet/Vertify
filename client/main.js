import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Workspaces } from '../imports/collections/tenant/workspace.js';
import { Versioning } from '../imports/collections/global/versioning.js';

import './main.html';

Highcharts = require( 'highcharts' );

Template.main.onCreated(function(){
  Meteor.subscribe('workspaces', function (){
    console.log( "Main - Workspaces now subscribed.");
  });
  Meteor.subscribe('versioning', function (){
    console.log( "Main - Versioning now subscribed.");
  });

  Meteor.subscribe('userdata', function(){
    console.log( "Main - Userdata now subscribed");
    
    if(Meteor.user()){
      var user = Meteor.user();
      if(typeof user.config != 'undefined'){
        var ws = Workspaces.findOne(user.config.workspace);
        if(ws){
          Session.set("currentWs", ws);
        }
        else{
          ws = Workspaces.findOne({}, {
            sort: {order : -1,}
          });
          Session.set("currentWs", ws);
        }
      }
    }
    else{
      ws = Workspaces.findOne({}, {
        sort: {order : -1,}
      });
      Session.set("currentWs", ws);
    }
  });

  // Set first workspace to session.
  // This will be overwritten when subscription finishes
  /*
  if(Workspaces.findOne()){
    ws = Workspaces.findOne({}, {
      sort: {order : -1,}
    });
    Session.set("currentWs", ws);
    console.log("Session set to:");
    console.log(ws);
  }*/
});

Template.main.helpers({
  versioning(){
    return Versioning.findOne({},{sort: { created: -1 }});
  }
});

Template.main.events({

});

Template.main.rendered = function () {
  //<!-- /Flot -->
  function gd(year, month, day) {
    return new Date(year, month - 1, day).getTime();
  }
  //<!-- /Flot -->
  this.autorun(function(){
    //TODO this is running multiple times, clean it up
    if(Meteor.user()){
      FlowRouter.watchPathChange();
      if(typeof Meteor.user().config != 'undefined')
      {
        var currentContext = FlowRouter.current();
        if(Meteor.user().config.route === currentContext.path){
          //console.log("same value");
          //DO nothing
        }
        else{
          //console.log("diff value");
          Meteor.tools.userConfigEdit(Meteor.userId(),{"route": currentContext.path});
        }
      }
    }
  });
}
