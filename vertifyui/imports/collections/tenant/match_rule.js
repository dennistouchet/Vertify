import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const MatchRules = new Mongo.Collection('match_rules');
export const MatchProperty = new Mongo.Collection('match_property');

MatchProperty.schema = new SimpleSchema({
  name:
    { type: String },
  match:
    { type: String },
  confidence:
    { type: Number },
  next:
    { type: String }
});

MatchRules.schema = new SimpleSchema({
  tenant_id:
    { type: Number },
  id:
    { type: Number },
  name:
    { type: String },
  modified:
    { type: Date },
  created:
    { type: Date },
  is_deleted:
    { type: Boolean },
  properties:
  { type: [MatchProperty.schema ]
    , optional: true }
});
