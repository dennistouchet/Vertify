import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tenants = new Mongo.Collection('tenants');

Tenants.schema = new SimpleSchema({
  modified:
    {type: Date},
  created:
    {type: Date},
  name:
    {type: String},
  //Required for tenant validation
  username:
    { type: String },
  password:
    {type: String},
  connection_string:
      {type: String},
  time_zone:
    { type: Number
    , max: 12
    , min: -12
    , defaultValue: 0
    , optional: true};
  daylight_savings:
    {type: Boolean},
  domain:
    {type: String},
  license_id:
    {type: String},
  expiration:
    {type: Date},
  is_paused:
    { type: Boolean },
  debug_expiration:
    {type: Date}
});
