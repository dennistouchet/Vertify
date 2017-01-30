import { Template } from 'meteor/templating';
import { Tenants } from '../../../../imports/collections/global/tenant.js';

Template.tenants.onCreated(function(){
    Meteor.subscribe('tenants', function(){
      console.log("Users - Tenants collection subscribed");
    });
    Meteor.subscribe('users', function(){
      console.log("Users - Users collection subscribed");
    });
    Meteor.subscribe('roles', function(){
      console.log("Users - Roles collection subscribed");
    });
});

Template.tenantadministration.helpers({
  tenants(){
    console.log(Tenants.find());
    return Tenants.find({});
  },
});

Template.addtenant.helpers({
  licenses(){
    licenses = [ "basic", "standard", "business", "corporate"];
    console.log(licenses);
    return licenses;
  }
})
