

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
      console.log(emailObj.verificationTokens);
      emailObj.verificationTokens.forEach(eobj => {
        console.log(eobj);
      });
      return emailObj.verificationTokens;
    }
  },
  getFirstPassword(passObj){
    if(passObj){
      console.log(passObj.bcrypt);
      return passObj.bcrypt;
    }
  },
  getFirstResume(resumeObj){

    if(resumeObj){
      console.log(resumeObj.loginTokens);
      resumeObj.loginTokens.forEach(robj => {
        console.log(robj);
      });
      return resumeObj.loginTokens;
    }
  }
});

Template.user.events({
  'click .edit': function(e){
    e.preventDefault();
    console.log("Clicked user:", this._id);
    ModalHelper.openUserEditModalFor(this._id);
  },
  'click .delete': function(e){
    e.preventDefault();
    Meteor.call('users.remove', this._id,
    (err, res) =>
    {
      if(err){
        console.log("error");
      }
      else{
        console.log("success");
      }
    });
  },
})
