import { Template } from 'meteor/templating';
import { Workspaces } from '../../../imports/collections/tenant/workspace.js';

Template.wsaddmodal.helpers({

});

Template.wsaddmodal.events({

  'click #save': function(e) {
    e.preventDefault();

    //reset errors
    var error = document.getElementById("nameerror");
    error.style.display = 'none';


    //TODO: ADD more value validation
    var name = document.getElementById("name");
    if(name.value) {
      console.log('workspace insert called with value: ' +  name.value);
      Meteor.call('workspaces.insert', name.value.trim())

      Modal.hide('wsaddmodal');

    } else {
      error.style.display = 'inline-block';
    }
  }
});

Meteor.subscribe('workspaces', function (){
  console.log( "Wsaddmodal - Workspaces now subscribed.");
});
