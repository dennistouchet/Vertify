import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Licenses = new Mongo.Collection('licenses');

Licenses.schema = new SimpleSchema({
  id:
    {type: String},
  modified:
    {type: Date},
  created:
    {type: Date},
  name:
    {type: String},
  max_concurrent_tasks:
    {type: Number},
  max_sytems_per_workspace:
    {type: Number},
  max_workspaces:
    {type: Number},
});
