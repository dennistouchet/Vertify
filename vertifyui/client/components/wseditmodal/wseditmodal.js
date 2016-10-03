import { Template } from 'meteor/templating';

import { Workspaces } from '../../../imports/collections/tenant/workspace.js';

Template.wseditmodal.helpers({
  workspace: function(){
    var wsId = Session.get('selectedWorkspace');

    if(typeof wsId !== "undefined") {
      var workspace = Workspaces.findOne(wsId);
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
    var wsId = Session.get('selectedWorkspace');
    var name = document.getElementById("name");

    //TODO: check if values are the same as initial values
    if(wsId) {
      console.log("workspace edit called");
      Meteor.call('workspaces.edit'
        , wsId, name.value.trim()
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
