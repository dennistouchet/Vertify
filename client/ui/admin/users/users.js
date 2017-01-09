import { Template } from 'meteor/templating';

import './users.html';

Template.users.onCreated(function(){
    Meteor.subscribe('users', function(){
      console.log("Users - Users collection subscribed");
    });
});

Template.users.helpers({
  users(){
    console.log("inside users template helpers");
    us = Meteor.users.find({});
    console.log(us);
    return us;
  },
});

Template.users.events({
  'click':function(){
    console.log("users page click event");
  }
});

Template.user.onCreated(function(){
    Meteor.subscribe('users', function(){
      console.log("User - Users collection subscribed");
    });
});

Template.user.helpers({
  getFirstEmail(emailObj){
    if(emailObj){
      emailObj.verificationTokens.forEach(eobj => {
      });
      return emailObj.verificationTokens;
    }
  },
  getFirstPassword(passObj){
    if(passObj){
      return passObj.bcrypt;
    }
  },
  getFirstResume(resumeObj){
    if(resumeObj){
      resumeObj.loginTokens.forEach(robj => {
      });
      return resumeObj.loginTokens;
    }
  }
});

Template.user.events({
  'click .edit': function(e){
    e.preventDefault();
    Meteor.tools.userEdit(this._id, {}, {});
    console.log("Clicked user:", this._id);
    ModalHelper.openUserEditModalFor(this._id);
  },
  'click .delete': function(e){
    e.preventDefault();
    Meteor.tools.userRemove(this._id);
  },
})
