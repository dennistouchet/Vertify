import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Highcharts = require( 'highcharts' );

Template.main.helpers({

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


Meteor.startup(function(){
  //Temporary development setup to load default workspace
  if(Meteor.isDevelopment){

    import { Workspaces } from '../imports/collections/tenant/workspace.js';

    if(Workspaces.find().count() > 0){
      var ws = Workspaces.findOne({}, {
        sort: {order : -1,}
      });

      Session.set("currentWs", ws);
    }
  }
});

//Temporary development setup to load default workspace
if(Meteor.isDevelopment){
Meteor.subscribe('workspaces', function (){
  console.log( "Main - Workspaces now subscribed.");
});
}
