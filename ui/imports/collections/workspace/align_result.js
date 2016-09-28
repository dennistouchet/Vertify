import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const AlignResults = new Mongo.Collection('align_results');

 export const FieldRule = new SimpleSchema({
   rule:
     { type: String },
   external_property:
     { type: String },
});

export const FieldRules = new SimpleSchema({
  external_object_id:
    { type: String },
    rule:
      { type: [FieldRule] },
  is_truth:
    {type: Boolean },
});

export const AlignResultsFields = new SimpleSchema({
  external_object_id:
    { type: Number },
  name:
    { type : String },
  is_truth:
    { type: Boolean },
  rules:
    { type: [FieldRules] }
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
    { type: [AlignResultsFields],
      min: 2 }
});
