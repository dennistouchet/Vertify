# SETUP METEOR USER ACCOUNTS

# packages to install

    meteor add accounts-password

    meteor add useraccounts:unstyled

    ##should install accounts-base but if it doesn't: meteor add accounts-base

# create basic template

    `<template name="login">
      <div class="login">
        <i class="glyphicon glyphicon-remove close-login"></i>
        {{> atForm}}
      </div>
    </template>`

    ## important side note:

        if the login fields to not appear for `{{> atForm}}` it is probably because
        you previously installed accounts-ui, created a user, and logged in. You will need to
        `meteor add accounts-ui`, log out of the user, and then `meteor remove accounts-ui`

#
