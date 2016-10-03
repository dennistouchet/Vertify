import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const AlignResults = new Mongo.Collection('align_results');

export const AlignmentObjectField = new SimpleSchema({
    external_object_id:
      { type : Number },
    external_property_path:
      { type: [String] },
    is_truth:
      { type: Boolean }
});

export const AlignmentVertifyField = new SimpleSchema({
  name:
    { type: String },
  friendly_name:
    { type: String
    , optional: true },
  align_method:
    { type: String
    , defaultValue: "Exact" },
  align_percent:
    { type: Number
    , defaultValue: 100 },
  approved:
    { type: Boolean
    , defaultValue: false },
  fields:
    { type: [AlignmentObjectField]}
});

AlignResults.schema = new SimpleSchema({
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
  alignment_properties:
    { type: [AlignmentVertifyField]
    , min: 2 },
  approved:
    { type: Boolean },
});

/*
export const ExternalObjects = new SimpleSchema({
  external_object_id:
    { type: String },
  external_property_path:
    { type: String
    , allowedValues: ["string", "array"] },
  name:
    { type: String },
  is_truth:
    {type: Boolean },
});

export const AlignmentProperties = new SimpleSchema({
  name:
    { type : String },
  friendly_name:
    { type: String },
  vertify_object_id:
    { type: Number },
  parent_vertify_property_id:
    { type: Number },
  external_objects:
    { type: [ExternalObjects] }
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
  alignment_properties:
    { type: [AlignmentProperties],
      min: 2 }
});
*/
