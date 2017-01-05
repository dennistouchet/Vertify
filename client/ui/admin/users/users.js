


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
  }
});

Template.users.events({
  'click':function(){
    console.log("users page click event");
  }
})
