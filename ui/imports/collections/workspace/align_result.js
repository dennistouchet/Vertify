import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const AlignResults = new Mongo.Collection('align_results');

export const AlignResultsFieldsSchema = new SimpleSchema({
  external_object_id:
    { type: Number },
  is_truth:
    { type: Boolean },
  total:
    { type: Number },
  aligned:
    { type: Number },
  duplicates:
    { type: Number },
  not_aligned:
    { type: Number },
});

AlignResults.schema = new SimpleSchema({
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
  total:
    { type: Number },
  aligned:
    { type: Number },
  duplicates:
    { type: Number },
  not_aligned:
    { type: Number },
  external_fields:
    { type: [AlignResultsFieldsSchema],
      min: 2 }
});
