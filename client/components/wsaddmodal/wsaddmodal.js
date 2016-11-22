import { Template } from 'meteor/templating';
import { Workspaces } from '../../../imports/collections/tenant/workspace.js';

Template.wsaddmodal.helpers({

});

Template.wsaddmodal.events({
  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("addErrSysModal");
    errDiv.innerHTML = ""; //reset errors

    //TODO: ADD more value validation
    var name = document.getElementById("name");
    if(name.value) {
      console.log('workspace insert called with value: ' +  name.value);
      Meteor.call('workspaces.insert'
        , name.value.trim()
        , (err, res) => {
          if(err){
            //console.log(err);
            //return false;
            errDiv.style.display = 'block';
            errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
          }
          else {
            // successful call
            Modal.hide('wsaddmodal');
          }
        });

    } else {
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[Missing Value] Please enter a value for the workspace name.</li>";
    }
  }
});

Meteor.subscribe('workspaces', function (){
  console.log( "Wsaddmodal - Workspaces now subscribed.");
});
