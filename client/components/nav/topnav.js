import { Template } from 'meteor/templating';
import { Workspaces } from '../../../imports/collections/tenant/workspace.js';

import './topnav.html';

Template.topnav.onCreated(function(){
  Meteor.subscribe('workspaces', function (){
    console.log( "Topnav - Workspaces now subscribed.");
  });

  if(Meteor.user()){
    var user = Meteor.user();
    if(typeof user.config != 'undefined'){
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
  }
  else{
    ws = Workspaces.findOne({}, {
      sort: {order : -1,}
    });
    Session.set("currentWs", ws);
  }

  var ws = Session.get("currentWs");
  if(ws)
    this.ws_id = new ReactiveVar(ws._id);
  else {
    this.ws_id = new ReactiveVar("");
  }
});
/*
Template.topnav.rendered = function(){
  this.autorun(function(){
  //NOTE: aybe try Tracker.autorun
  });
}*/

Template.topnav.helpers({
  workspaces() {
    return Workspaces.find({});
  },
  workspace(name){
    return Workspace.findOne({"name": name});
  },
  hasWorkspace : function(){
    if(Session.get("currentWs")){
      return true;
    }
    else {
      return false;
    }
  },
  getWorkspace : function(){
    if(Session.get("currentWs")){
      //TODO replace session with ReactiveVar
      console.log("topnav reactive var:", Template.instance().ws_id.get());
      var ws = Session.get("currentWs");
      var newws = Workspaces.findOne(ws._id);
      if(newws){
        Session.set("currentWs", newws);
        return newws.name;
      }
      else {
        return "Workspaces";
      }
    }
    else {
      return "Workspaces";
    }
  },
});

Template.topnav.events({
  'click': function(e, t) {
    console.log('topnav click event');
  },
  'click .wkspcddl li a':function(e, t){
    var btnprnt = $(e.target).parent().parent().parent();
    var text = e.target.text;

    console.log("Wkspcddl click event.");
    if(text) {
        ws = Workspaces.findOne({"name": text});
        if(ws){
        Session.set("currentWs", ws);
        console.log("TopNav - Set currentWs to: ", ws);

        t.ws_id.set(ws._id);
        console.log("Current user:",Meteor.user());

        if(Meteor.user().config.workspace == ws._id){
          console.log("same value");
          //DO nothing
        }
        else{
          console.log("diff value");
          Meteor.tools.userConfigEdit(Meteor.userId(),{"workspace": ws._id});
        }
      }
      else{
        //TODO: throw error
      }
    }
  },
  'click .logout': ()=>{
    AccountsTemplates.logout();
  }
});
