// User Account AccountTemplate Configuration File
/*Accounts.onCreatedUser((options, user) => {
  //Add configuration object and default values
  const config_state = {
    selected_workspace: "",
    current_route: "/setup",
    collect: {},
    match: {},
    align: {},
    fix: {}
  }

  user.config = config_state;

  return user;
});*/

// Hook Functions
var myPostSignUp = function(userId, info){
  console.log(userId);
  console.log(info);
  Roles.addUsersToRoles( userId, ['view-only', 'standard', 'admin']);
}

var myLogoutFunc = function(){
  console.log("User Logged Out");
  //TODO: Add routing here and session clearing
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
