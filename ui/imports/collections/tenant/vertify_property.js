import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const VertifyProperties = new Mongo.Collection('vertify_properties');


var _rules = [ "set" ] // . "translate", "convert", "lookup", "advanced" ]
var _advancedRules = [ "split", "math", "sparator", "condition",
                      "formatters", "replace", "case", "date",
                      "phone", "url", "truncate", "round" ]

var _sync_actions = [ "add", "update", "empty", "add_update" ];
var _directions = [ "inbound", "outbound", "bidirectional", "none" ];

VertifyPropertyRulesRuleSchema = new SimpleSchema({
  set:
  { type: Object
  , optional: true },
  "set.external_property":
  { type: String
  , optional: true },
  translate:
  { type: Object
  , optional: true },
  "translate.external_property":
  { type: String
  , optional: true },
  convert:
  { type: Object
  , optional: true },
  "convert.external_property":
  { type: String
  , optional: true },
  lookup:
  { type: Object
  , optional: true },
  "lookup.external_property":
  { type: String
  , optional: true }

});

VertifyPropertyRulesSchema = new SimpleSchema({
  external_object_id:
    { type: Number },
  property_group:
    { type: Number
      , optional: true },
  direction:
    { type: String
    , allowedValues: _directions },
  sync_action:
    { type: String
    , allowedValues: _sync_actions },
  rule:
    { type: VertifyPropertyRulesRuleSchema },
  is_truth:
    { type: Boolean }
});

VertifyPropertyExternalObjectsSchema = new SimpleSchema({

    external_object_id:
      { type: Number },
    external_property_path:
      { type: String
      , optional: true },
    name:
      { type: String
      , optional: true },
    property_group:
      { type: Number },
    inbound:
      { type: Object },
    "inbound.sync_action":
      { type: String
      , allowedValues: _sync_actions },
    "inbound.filter":
      { type: Object
      , blackbox: true
      , optional: true },
    outbound:
      { type: Object },
    "outbound.sync_action":
      { type: String
      , allowedValues: _sync_actions },
    "outbound.filter":
      { type: Object
      , blackbox: true
      , optional: true },
    match:
      { type: Object
      , blackbox: true
      , optional: true },
    is_truth:
      { type: Boolean }
});

VertifyProperties.schema = new SimpleSchema({
  tenant_id:
    { type: Number },
  id:
    { type: Number },
  modified:
    { type: Date },
  created:
    { type: Date },
  is_deleted:
    { type: Boolean },
  workspace_id:
    { type: Number },
  vertify_object_id:
    { type: Number },
  parent_property_id:
    { type: Number },
  task_status:
    { type: String
    , optional: true },
  name:
    { type: String },
  friendly_name:
    { type: String },
  type:
    { type: String
    , allowedValues: [ "string","array"] }, //rules object for string //external_objects for array
  level:
    { type: Number },
  rules:
    { type: [VertifyPropertyRulesSchema]
    , optional: true },
  external_objects:
    { type: [VertifyPropertyExternalObjectsSchema]
    , optional: true }
});
