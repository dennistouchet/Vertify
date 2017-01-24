import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tenants = new Mongo.Collection('tenants');

Meteor.methods({
  'tenant.insert'(){
    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    console.log("TODO: tenant insert");
  },
  'tenant.update'(t_id,u_id){
    check(t_id, String);
    check(u_id);
    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    //Check that user is super-admin or admin
    Console.log("TODO: check user role and group. ");
  }

});

Tenants.schema = new SimpleSchema({
  modified:
    {type: Date},
  created:
    {type: Date},
  name:
    {type: String},
  //Required for tenant validation
  username:
    { type: String,
    optional: true },
  password:
    {type: String,
    optional: true },
  connection_string:
    {type: String,
    optional: true },
  time_zone:
    { type: Number,
      max: 12,
      min: -12,
      defaultValue: 0,
      optional: true },
  daylight_savings:
    {type: Boolean,
    optional: true},
  domain:
    {type: String,
    optional: true},
  license_id:
    {type: String,
    optional: true},
  expiration:
    {type: Date,
    optional: true},
  is_paused:
    { type: Boolean,
    optional: true },
  debug_expiration:
    {type: Date,
    optional: true}
});
