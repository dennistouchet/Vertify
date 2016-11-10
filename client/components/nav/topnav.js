import { Template } from 'meteor/templating';
import { Workspaces } from '../../../imports/collections/tenant/workspace.js';

import './topnav.html';

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
      console.log("TopNav - Set session currentWs set to: ");
      console.log(ws);
    }
  },
});
