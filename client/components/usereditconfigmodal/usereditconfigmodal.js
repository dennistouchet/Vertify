import { Template } from 'meteor/templating';
import { Workspaces } from '../../../imports/collections/tenant/workspace.js';

Template.usereditconfigmodal.onCreated(function(){
  var ws = document.getElementById("workspace");
  var router = document.getElementById("route");

  console.log("current user:", Meteor.user());
})

Template.usereditconfigmodal.helpers({
  userConfig(){
    current = Meteor.user();
    if(current){
        return current.config;
    }
  }
});

Template.usereditconfigmodal.events({
'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("editErrUserModal");
    errDiv.display = 'none';
    errDiv.innerHtml = ''; //reset errors

    //TODO: ADD more value validation
    var name = document.getElementById("name");
    var pass = document.getElementById("pass");
    var pass2 = document.getElementById("pass2");
    var verified = document.getElementById("verified");

    var _id = Session.get("selectedUser");
    if(name.value) {
      console.log('users edit called with value: ' +  name.value);
      Meteor.call('users.edit'
        , _id
        , name.value.trim()
        , (err, res) => {
          if(err){
            //console.log(err);
            //return false;
            errDiv.style.display = 'block';
            errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[' + err.error + '] ' + err.reason + '</li>';
          }
          else {
            // successful call
            Modal.hide('usereditmodal');
          }
        });

    } else {
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[Missing Value] Please enter a value for the workspace name.</li>';
    }
  }
});
