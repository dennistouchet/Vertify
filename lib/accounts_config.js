// User Account AccountTemplate Configuration File

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
  /*
  onLogoutHook:
  onSubmitHook:
  preSignupHook:
  postSignupHook:
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
