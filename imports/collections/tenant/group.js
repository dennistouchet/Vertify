import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Groups = new Mongo.Collection('groups');

Groups.schema = new SimpleSchema({
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
  name:
    { type: String }
});
