import { Template } from 'meteor/templating';
import { Workspaces } from '../../../imports/collections/tenant/workspace.js';

Template.wseditmodal.helpers({

});

Template.wseditmodal.events({
  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("editErrWsModal");
    errDiv.innerHTML = ""; //reset errors

    //TODO: ADD more value validation
    var name = document.getElementById("name");
    var _id = Session.get("selectedWorkspace");
    if(name.value) {
      console.log('workspace edit called with value: ' +  name.value);
      Meteor.call('workspaces.edit'
        , _id
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
