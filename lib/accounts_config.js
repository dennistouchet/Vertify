// User Account AccountTemplate Configuration File
if(Meteor.isServer){
  Accounts.onCreateUser((options, user) => {
    //Add configuration object and default values
    /*const config_state = {
      selected_workspace: "",
      current_route: "/setup",
      collect: {},
      match: {},
      align: {},
      fix: {}
    }

    user.config = config_state;*/
    console.log("new user created", "TODO: add custom fields");

    return user;
  });
}
// Hook Functions
var myPostSignUp = function(userId, info){
  console.log(userId);
  console.log(info);
  Roles.addUsersToRoles( userId, ['view-only']);

  var user = Meteor.users.findOne(userId);
  if(user)
    Meteor.users.update(user._id,{$set:{"config":{workspace:"",route:"/", subdomain: ""}}});
}

var myLogoutFunc = function(){
  console.log("Logging User Out");
  //TODO: Save any possible state/config
  // workspace, route, domain should be saved on change, not here
  //FlowRouter.go('/');

  //Clear individual key values, then clear Session.keys
  Object.keys(Session.keys).forEach(function(key){
    Session.set(key, undefined);
  });
  Session.keys = {}
}

// Account Template Options Config
options = {
  // behavior options
  confirmPassword: true,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  sendVerificationEmail: true,
  lowercaseUsername: false,
  focusFirstInput: true,

  // appearance
  showAddRemoveServices: false,
  showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: false,
  showResendVerificationEmailLink: false,

  // client-side validation
  continuousValidation: false,
  negativeFeedback: false,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,

  // privacy and terms
  privacyUrl: 'privacy',
  termsUrl: 'terms-of-user',

  // redirects
  homeRoutePath: '/',
  redirectTimeout: 3000,

  // hooks
  onLogoutHook: myLogoutFunc,
  postSignUpHook: myPostSignUp,
  /*
  onSubmitHook:
  preSignupHook:
  */

  // element text
  texts: {
    button: {
      signIn: "Sign In",
      signUp: "Create Account"
    },
    title: {
      forgotPwd: "Forgot my Password"
    },
  },
}
AccountsTemplates.configure(options);
