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
  Meteor.subscribe('userdata', this._id, function (){
    console.log( "Main - User now subscribed.");
  });
  Meteor.subscribe('versioning', function (){
    console.log( "Main - Versioning now subscribed.");
  });

  if(Meteor.isDevelopment){
    if(Workspaces.findOne()){
      //TODO: change this to load by user config
      var ws = Workspaces.findOne({"name": "Jim's Workspace"});

      if(ws){
        Session.set("currentWs", ws);
      }
      else{
        ws = Workspaces.findOne({}, {
          sort: {order : -1,}
        });
        Session.set("currentWs", ws);
      }
      console.log("Session set to:");
      console.log(ws);
    }
  }
  /*
    TODO: persist session with localstorage
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
}
