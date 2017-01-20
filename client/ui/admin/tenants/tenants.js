import { Template } from 'meteor/templating';
import { Tenants } from '../../../../imports/collections/global/tenant.js';

Template.tenants.onCreated(function(){
    Meteor.subscribe('tenants', function(){
      console.log("Users - roles collection subscribed");
    });
    Meteor.subscribe('users', function(){
      console.log("Users - Users collection subscribed");
    });
    Meteor.subscribe('roles', function(){
      console.log("Users - roles collection subscribed");
    });
});

Template.tenants.helpers({
  tenants(){
    return Tenants.find();
  }
});
