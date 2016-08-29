import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const VertifyObjects = new Mongo.Collection('vertify_objects');

var operators = [ "eq", "ne", "gt", "gte", "lt", "lte", "in", "nin", "like", "notlike", "isnull", "isnotnull", "between", "and", "or", "fuzzy", "then"];


export const VertifyObjectExternalObjectsSchema = new SimpleSchema({
  external_object_id:
    { type: String },
  inbound:
    { type: Object },
  "inbound.sync_action":
    { type: [String]
    , allowedValues: [ "add", "update", "delete"] },
  "inbound.filter":
    { type: Object
    , optional: true  },
  "inbound.filter.external_property":
    { type: String
    , optional: true  },
  "inbound.filter.operator":
    { type: String
    , allowedValues: operators
    , optional: true  },
  "inbound.filter.value":
    { type: [Object]
    , optional: true },
  "inbound.filter.value.$.external_property":
    { type: String
    , optional: true  },
  "inbound.filter.value.$.operator":
    { type: String
      , allowedValues: operators
      , optional: true  },
  "inbound.filter.value.$.value":
    { type: [Object]
    , blackbox: true },
  outbound:
    { type: Object },
  "outbound.sync_action":
    { type: [String]
    , allowedValues: [ "add", "update", "delete"] },
  "outbound.filter":
    { type: Object
    , optional: true },
  "outbound.filter.external_property":
    { type: String
    , optional: true  },
  "outbound.filter.operator":
    { type: String
    , allowedValues: operators
    , optional: true },
  "outbound.filter.value":
    { type: [Object]
    , optional: true},
  "outbound.filter.value.$.external_property":
    { type: String
    , optional: true },
  "outbound.filter.value.$.operator":
    { type: String
    , allowedValues: operators
    , optional: true },
  "outbound.filter.value.$.value":
    { type: [Object]
    , blackbox: true },
  match:
    { type: Object },
  "match.external_property":
    { type: String
    , optional: true},
  "match.operator":
    { type: String
    , allowedValues: operators },
  "match.vertify_property":
    { type: String
    , optional: true},
  "match.group":
  { type: [Object]
  , blackbox: true
  , optional: true },
  "match.confidence":
  { type: Number
  , optional: true },
  is_truth :
    { type: Boolean }
});


VertifyObjects.schema = new SimpleSchema({
  tenant_id:
    { type: Number },
  id:
    { type: String },
  modified:
    { type: Date },
  created:
    { type: Date },
  is_deleted:
    { type: Boolean },
  name:
    { type: String },
  workspace_id:
    { type: String },
  external_objects:
    { type: [VertifyObjectExternalObjectsSchema] }
});
