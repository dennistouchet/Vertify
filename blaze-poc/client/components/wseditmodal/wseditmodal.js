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

    //TODO: VERIFY WORKSPACE ID

    var wsId = Session.get('selectedWorkspace');

    var name = document.getElementById("name");

    //TODO: check if values are the same as initial values

    if(wsId) {
      console.log('workspace edit called');
      Meteor.call('workspaces.edit', wsId, name.value.trim());
    } else {
      alert('Error: No workspace selected.')
      //console.log('workspace insert called');
      //Meteor.call('workspaces.insert', name.value.trim())
    }

    //TODO: VALUE VERIFICATION

    Modal.hide('wseditmodal');

  }
});

Meteor.subscribe('workspaces', function (){
  console.log( "Wseditmodal - Workspaces now subscribed.");
});
