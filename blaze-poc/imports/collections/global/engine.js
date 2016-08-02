import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Engines = new Mongo.Collection('engines');

Engines.schema = new SimpleSchema({
  id:
    {type: String},
  modified:
    {type: Date},
  created:
    {type: Date},
  password:
    {type: String},
  last_poll:
    {type: Date},
  instance_start:
    {type: Date},
  instance_end:
    {type: Date},
  instance_id:
    {type: String},
  current_load:
    {type: Boolean},
  is_local:
    {type: Boolean},
  status:
    {type: String},
  version:
    {type: String},
  external_ip:
    {type: String},
  internal_ip:
    {type: String},
  last_login
  instance_ami:
    {type: String}
});
