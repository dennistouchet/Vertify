import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tenants = new Mongo.Collection('tenants');

Tenants.schema = new SimpleSchema({
  id:
    {type: String},
  modified:
    {type: Date},
  created:
    {type: Date},
  name:
    {type: String},
  sql_connect_string:
    {type: String},
  time_zone:
    { type: Number
    , max: 12
    , min: -12
    , defaultValue: 0
    , optional: true};
  daylight_savings:
    {type: Boolean},
  sql_user:
    {type: String},
  sql_password:
    {type: String},
  domain:
    {type: String},
  license_id:
    {type: String},
  expiration:
    {type: Date},
  is_paused
  debug_expiration:
    {type: Date}
});
