import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Agents = new Mongo.Collection('agents');

Agents.schema = new SimpleSchema({
  tenant_id:
    { type: String },
  id:
    { type: String },
  modified:
    { type: Date },
  created:
    { type: Date },
  is_deleted:
    { type: Boolean },
  password:
    { type: String },
  last_poll:
    { type: Date }
  instance_start:
    { type: Date }
  instance_end:
    { type: Date }
  instance_id:
    { type: Number },
  current_load:
    { type: Number },
  status:
    { type: String },
  version:
    { type: String },
  installer_computer_name:
    { type: String },
  installer_id:
    { type: String },
  external_ip:
    { type: String },
  internal_ip:
    { type: String },
  name:
    { type: String },
  last_login:
    { type: Date }
});
