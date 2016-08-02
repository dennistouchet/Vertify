import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Roles = new Mongo.Collection('roles');

Roles.SimpleSchema = new SimpleSchema({
  id:
    {type: String},
  modified:
    {type: Date},
  created:
    {type: Date},
  permissions:
    {type: [Object]},
  workspaces:
   {type: [String]},
  objects:
    {type: [String]}
});
