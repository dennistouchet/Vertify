

Template.loginmain.onCreated(function(){
  this.logintoggle = new ReactiveVar('open');
});

Template.loginmain.helpers({
  navtoggle(){
    //needs to be a reactive var
    return Template.instance().logintoggle.get();
  }
});

Template.loginmain.events({
  'click .login-toggle': (e,t)=> {
    console.log("login toggle click event");
    t.logintoggle.set('open');
    ModalHelper.openLoginModalFor();
  },
  'click .close-login': (e,t)=> {
    console.log("close login click event");
    t.logintoggle.set('');
  },
  'click .logout': ()=>{
    AccountsTemplates.logout();
  },
  'submit form': (e,t)=>{
    //console.log("e",e);
    //console.log("t", t);
    //TODO: LOGIN/REGISTER EVENT
  }
});

Template.loginmodal.events({
  'click .submit': (e,t)=>{
    console.log("attempt to close modal");
    //TODO: change reactive var from other template
    Modal.hide('loginmodal');
  }
});
