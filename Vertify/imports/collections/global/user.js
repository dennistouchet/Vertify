import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Users = new Mongo.Collection('users');

Users.schema = new SimpleSchema({
  tenant_id:
    {type: Number},
  id:
    {type: String},
  modified:
    {type: Date},
  created:
    {type: Date},
  username:
    {type: String},
  password:
    {type: String},
  email::
    {type: String},
  first_name:
    {type: String},
  last_name:
    {type: String},
  current_workspace_id:
    {type: String},
  last_login:
    {type: Date},
  roles:
    { type: [String]}

});
