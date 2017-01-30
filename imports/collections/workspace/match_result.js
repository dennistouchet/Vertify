import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const MatchResults = new Mongo.Collection('match_results');

Meteor.methods({
  'match_results.remove'(ws_id, vo_id){
    check(ws_id, String);
    check(vo_id, String);
    //TODO: import this remove with vertify object id
    console.log("match results remove running");
    var current = MatchResults.findOne({"workspace_id": ws_id, "vertify_object_id": vo_id});
    if(current)
      return MatchResults.remove({"workspace_id": ws_id, "vertify_object_id": vo_id});

    console.log("match results remove finished");
    //throw new Meteor.Error(500, "Missing Value", "No Match Results found in Workspace: " + ws_id + " with ID: " + vo);
  },
});

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
    { type: String },
  modified:
    { type: Date},
  created:
    { type: Date },
  is_deleted:
    { type: Boolean
    , defaultValue: false },
  workspace_id:
    { type: String },
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
      min: 2 },
  match_object:
    { type: Object
    , blackbox: true
    , optional: true }
});
