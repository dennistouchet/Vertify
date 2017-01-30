Meteor.users.allow({
  //TODO: SET THESE UP TO SEND USER TO UNAUTHORIZED PAGE
  insert: function(userId){
    var currentUser = Meteor.userId();
    if(currentUser){
        var user = Meteor.users.findOne(currentUser);
        if(user){
          return Roles.userIsInRole(user._id,'admin');
        }
    }
    return false;
  },
  update: function(userId){
    var currentUser = Meteor.userId();
    if(currentUser){
        var user = Meteor.users.findOne(currentUser);
        if(user){
          return true;//Roles.userIsInRole(user._id,'admin');
        }
    }
    return false;
  },
  remove: function(userId){
    //console.log("param userId", userId);
    //console.log("current user id:", Meteor.userId());
    var currentUser = Meteor.userId();
    if(currentUser){
        var user = Meteor.users.findOne(currentUser);
        if(user){
          return Roles.userIsInRole(user._id,'admin');
        }
    }
    return false;
  }
});
