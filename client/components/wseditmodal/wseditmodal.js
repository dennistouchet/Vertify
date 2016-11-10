import { Template } from 'meteor/templating';

import { Workspaces } from '../../../imports/collections/tenant/workspace.js';

Template.wseditmodal.helpers({
  workspace: function(){
    var ws_id = Session.get('selectedWorkspace');

    if(typeof ws_id !== "undefined") {
      var workspace = Workspaces.findOne(ws_id);
      return workspace;
    } else {
      return {name: ''}
    }
  }
});

Template.wseditmodal.events({

  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("editErrModal");
    errDiv.innerHTML = ""; //reset errors

    //TODO: VERIFY WORKSPACE ID
    var ws_id = Session.get('selectedWorkspace');
    var name = document.getElementById("name");

    //TODO: check if values are the same as initial values
    if(ws_id) {
      console.log("workspace edit called");
      Meteor.call('workspaces.edit'
        , ws_id, name.value.trim()
        , (err, res) => {
          if(err){
            //console.log(err);
            //return false;
            errDiv.style.display = 'block';
            errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
          }
          else {
            // successful call
            // return true;
            Modal.hide('wseditmodal');
          }
        });
    } else {
      alert("Error: No workspace selected.")
    }
  }
});

Meteor.subscribe('workspaces', function (){
  console.log( "Wseditmodal - Workspaces now subscribed.");
});
