import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const MatchRules = new Mongo.Collection('match_rules');

MatchRules.schema = new SimpleSchema({
  tenant_id:
    { type: Number },
  id:
    { type: String },
  name::
    { type: String },
  modified:
    { type: Date },
  created:
    { type: Date },
  is_deleted:
    { type: Boolean },
  "properties.$.name":
    { type: String },
  "properties.$.match":
    { type: String },
  "properties.$.confidence":
    { type: Number },
  "properties.$.next":
    { type: String }
  //This object should always be a set of MatchProperties type
  /*
  matchProperties:
  {
    type: [Object]
    , optional: true
  }
  */
  });


//TODO: LOOK INTO USING ACTUAL COLLECTIONS INSTEAD OF " .$. " arrays
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
