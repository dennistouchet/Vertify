

Template.loginmodal.helpers({
  navtoggle(){
    return Session.get('nav-toggle');
  }
});

Template.loginmodal.events({
  'click .login-toggle': ()=> {
    console.log("login toggle click event");
    Session.set('nav-toggle', 'open');
  },
  'click .close-login': ()=> {
    console.log("close login click event");
    Session.set('nav-toggle', '');
  },
  'click .logout': ()=>{
    Meteor.logout();
  }
});
