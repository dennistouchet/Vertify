import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const FixUnmatchedRecords = new Mongo.Collection('fix_unmatched_records');

FixUnmatchedRecords.schema = new SimpleSchema({
  tenant_id:
    { type: Number },
  id:
    { type: Number },
  modified:
    { type: Date},
  created:
    { type: Date },
  is_deleted:
    { type: Boolean
    , defaultValue: false },
  workspace_id:
    { type: Number },
  vertify_object_id:
    { type: Number },
  name:
    { type: String },
  value:
    { type: String }
});
