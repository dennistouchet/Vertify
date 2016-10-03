import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Permissions = new Mongo.Collection('permissions');

Permissions.schema = new SimpleSchema({
  id:
    {type: String},
  name:
    {type: String},
  modified:
    {type: Date},
  created:
    {type: Date},
  actions:
    {type: [Object]}
});
