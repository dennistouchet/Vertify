import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const MatchResults = new Mongo.Collection('match_results');

export const MatchResultsExternalObjectsSchema = new SimpleSchema({
  external_object_id:
    { type: Number },
  is_truth:
    { type: Boolean },
  total:
    { type: Number },
  matched:
    { type: Number },
  duplicates:
    { type: Number },
  not_matched:
    { type: Number },
});

MatchResults.schema = new SimpleSchema({
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
  matched:
    { type: Number },
  duplicates:
    { type: Number },
  not_matched:
    { type: Number },
  external_objects:
    { type: [MatchResultsExternalObjectsSchema],
      min: 2 }
});
