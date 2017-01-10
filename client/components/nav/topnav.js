import { Template } from 'meteor/templating';
import { Workspaces } from '../../../imports/collections/tenant/workspace.js';

import './topnav.html';

Template.topnav.onCreated(function(){
  Meteor.subscribe('workspaces', function (){
    console.log( "Topnav - Workspaces now subscribed.");
  });
  //TODO: change this to load by user config
  var ws = Session.get("currentWs");
  var user = Meteor.user();
  console.log(typeof user.config);
  if(typeof user.config != 'undefined'){
    console.log("workspace set by user config! yay!");
    this.ws_id = user.config.workspace;
  }
  else if(ws){
    this.ws_id = new ReactiveVar(ws._id);
  }
});

Template.topnav.helpers({
  workspaces() {
    return Workspaces.find({});
  },
  workspace(i){
    return Workspace.findOne({"name": i});
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
      //This makes sure the text is update if the Workspace is edited
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
  'click': function(e) {
    console.log('topnav click event');
  },
  'click .wkspcddl li a':function(e, template){
    var btnprnt = $(e.target).parent().parent().parent();
    var text = e.target.text;

    console.log("Wkspcddl click event.");
    if(text) {
      ws = Workspaces.findOne({"name": text});
      Session.set("currentWs", ws);
      console.log("TopNav - Set session currentWs set to: ", ws);
      //TODO update user config here
      console.log("TODO: update User config ws!");
    }
  },
  'click .logout': ()=>{
    //Meteor.logout();
    AccountsTemplates.logout();
  }
});
