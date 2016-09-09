import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const VertifyObjects = new Mongo.Collection('vertify_objects');

var operators = [ "eq", "ne", "gt", "gte", "lt", "lte", "in", "nin", "like", "notlike", "isnull", "isnotnull", "between", "and", "or", "fuzzy", "then"];

export const VertifyObjectExternalObjectOutboundSchema = new SimpleSchema({
  sync_action:
    { type: [String]
    , allowedValues: [ "add", "update", "delete"] },
  filter:
    { type: Object
    , optional: true },
  "filter.external_property":
    { type: String
    , optional: true  },
  "filter.operator":
    { type: String
    , allowedValues: operators
    , optional: true },
  "filter.value":
    { type: [Object]
    , optional: true},
  "filter.value.$.external_property":
    { type: String
    , optional: true },
  "filter.value.$.operator":
    { type: String
    , allowedValues: operators
    , optional: true },
  "filter.value.$.value":
    { type: [Object]
    , blackbox: true },
});

export const VertifyObjectExternalObjectInboundSchema = new SimpleSchema({
  sync_action:
    { type: [String]
    , allowedValues: [ "add", "update", "delete"] },
  filter:
    { type: Object
    , optional: true  },
  "filter.external_property":
    { type: String
    , optional: true  },
  "filter.operator":
    { type: String
    , allowedValues: operators
    , optional: true  },
  "filter.value":
    { type: [Object]
    , optional: true },
  "filter.value.$.external_property":
    { type: String
    , optional: true  },
  "filter.value.$.operator":
    { type: String
      , allowedValues: operators
      , optional: true  },
  "filter.value.$.value":
    { type: [Object]
    , blackbox: true },
});

export const VertifyObjectMatchGroupGroupSchema = new SimpleSchema({
  external_property:
    { type: String},
  operator:
    { type: String
    , allowedValues: operators },
  vertify_property:
    { type: String },
  confidence:
    { type: Number
      , optional: true },
  group:
    { type: [VertifyObjectMatchGroupGroupSchema]
    , optional: true
    , blackbox: true }
});

export const VertifyObjectMatchGroupSchema = new SimpleSchema({
  external_property:
    { type: String
    , optional: true },
  operator:
    { type: String
    , allowedValues: operators },
  vertify_property:
    { type: String
    ,  optional: true },
  confidence:
    { type: Number
      , optional: true },
  group:
    { type: [VertifyObjectMatchGroupGroupSchema]
    , optional: true }
});

export const VertifyObjectMatchSchema = new SimpleSchema({
  external_property:
    { type: String
    , optional: true},
  operator:
    { type: String
    , allowedValues: operators },
  vertify_property:
    { type: String
    , optional: true},
  confidence:
    { type: Number
    , optional: true },
  group:
    { type: [VertifyObjectMatchGroupSchema]
      , optional: true },
});

export const VertifyObjectExternalObjectsSchema = new SimpleSchema({
  external_object_id:
    { type: String },
  inbound:
    { type: VertifyObjectExternalObjectInboundSchema },
  outbound:
    { type: VertifyObjectExternalObjectOutboundSchema },
  match:
    { type: VertifyObjectMatchSchema
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
