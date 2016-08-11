import { Template } from 'meteor/templating';
import { Workspaces } from '../../../../imports/collections/tenant/workspace.js';
import { Systems } from '../../../../imports/collections/tenant/system.js';
import { Objects } from '../../../../imports/collections/tenant/object.js';

Template.match.helpers({
  hasWorkspace: function(){
    var ws = Session.get("currentWs");
    if(ws == null){
      console.log("Match - No workspace selected");
      return "No Workspace selected.";
    }
    else{
      console.log("Match - current workspace: " + ws.name);
      return ws.name;
    }
  },
  hasSystems : function(){
    if(Session.get("systemCount")){
      var sysCnt = parseInt(Session.get("systemCount"));
      if(sysCnt > 0){
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  hasEnoughObject : function(){
    if(Session.get("objectCount")){
      var objectcount =  parseInt(Session.get("objectCount"));
      if(objectcount > 1){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  },
});


Template.match.events({
  'click .myAlert' : function(e){
      e.preventDefault();
      var hd = "hotdog";
      console.log("My val: " + hd);
      var val = Meteor.tools.myAlert(hd);
      console.log("Return val: " + val);
  },
  'click .addCustom' : function(e){
      e.preventDefault();
      console.log('Match - addCustom event clicked.');
      FlowRouter.go('/setup/match/vertifywizard');
  },
});

Meteor.subscribe('workspaces', function (){
  console.log( "Match - Workspaces now subscribed.");
});

Meteor.subscribe('systems', function (){
  console.log( "Match - Systems now subscribed.");
});

Meteor.subscribe('objects', function (){
  console.log( "Match - Objects now subscribed.");
});
