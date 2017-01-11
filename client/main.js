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
  Meteor.subscribe('userdata', Meteor.userId(), function(){
    console.log( "Main - Userdata now subscribed");
    var user = Meteor.user();
    if(typeof user.config.workspace != 'undefined'){
      console.log("main", user);
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
  });

  // Set first workspace to session.
  // This will be overwritten when subscription finishes
  if(Workspaces.findOne()){
    ws = Workspaces.findOne({}, {
      sort: {order : -1,}
    });
    Session.set("currentWs", ws);
    console.log("Session set to:");
    console.log(ws);
  }
  /*
    TODO: persist session with localstorage
    // NOTE: 1/11/17 PROBABLY DONT NEED THIS Is INTRO OF USER
    get state // var val = locqalStorage.getItem('workspace');
    return{ val : val },
    setState (val)
    // localStorage.setItem( 'workspace', option);
    // this.setState ( { val : option }) // or Session.set('currentWs', option);
  */
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
    FlowRouter.watchPathChange();
    var currentContext = FlowRouter.current();
    //TODO update user config route here
  });
}
