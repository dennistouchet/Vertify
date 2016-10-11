import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { AlignResults } from '../workspace/align_result.js';

export const VertifyProperties = new Mongo.Collection('vertify_properties');


var _rules = [ "set" ] // . "translate", "convert", "lookup", "advanced" ]
var _advancedRules = [ "split", "math", "sparator", "condition",
                      "formatters", "replace", "case", "date",
                      "phone", "url", "truncate", "round" ]

var _sync_actions_arr = [ "add", "update", "delete" ];

var _sync_actions_enum = [ "add", "update", "empty", "add_update"];

var _directions = [ "inbound", "outbound", "bidirectional", "none" ];

Meteor.methods({
  'vertify_properties.insertSingle'(vo, matchResult){
    //TODO: needed for match
    console.log("vertify_properties.insertSingle function stub called.");
  },
  'vertify_properties.insertMultiple'(ws, vo){
    /*
    var ruleobj = {
      rule: alignResults.alignment_properties[i].align_method,
      external_property: alignResults.alignment_properties[i].fields[j]
      value: {}
    }

    var extobj = {
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
        , allowedValues: _sync_actions_enum },
      rule:
        { type: VertifyPropertyRulesRuleSchema },
      is_truth: alignResults.alignmentProperties[i]
    }*/
    //TODO: ADD Vertify Object ID to filter once alignresults are actually being created
    
    var alignResults = AlignResults.findOne({"workspace_id": ws});//,"vertify_object_id": vo});
    var Properties = [];

    alignResults.alignment_properties.forEach(function(alignproperty){
      if(alignproperty.approved){
        var newProperty = {
          modified: new Date(),
          created: new Date(),
          is_deleted: false,
          workspace_id: alignResults.workspace_id,
          //TODO: change this once real Align results are created
          vertify_object_id: vo,//alignResults.vertify_object_id,
          parent_property_id: null,
          task_status: "queued",
          name: alignproperty.name,
          friendly_name: alignproperty.name,
          //friendly_name: alignproperty.friendly_name,
          level: 0,
        }
        Properties.push(newProperty);
      }
    });

    vplist = [];
    Properties.forEach(function(vp){
      VertifyProperties.schema.validate(vp);
      var id = VertifyProperties.insert(vp);
      vplist.push(id);
    });

    return vplist;
  },
  'vertify_properties.edit'(){
    console.log("vertify_properties.edit function stub called.");
  },
  'vertify_properties.remove'(id, vo, wsid){
    var current = VertifyProperties.findOne(id, {"vertify_object_id": vo, "workspace_id": wsid});
    VertifyProperties.remove(current._id);
  },
})

VertifyPropertyRulesRuleSchema = new SimpleSchema({
  rule:
  { type: String
  , allowedValues: _rules },
  external_property:
  { type: String },
  value:
  { type: Object
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
    , allowedValues: _sync_actions_enum },
  rule:
    { type: VertifyPropertyRulesRuleSchema },
  is_truth:
    { type: Boolean }
});

VertifyPropertyExternalObjectsSchema = new SimpleSchema({
    external_object_id:
      { type: Number },
    external_property_path:
      { type: [String]
      , optional: true },
    name:
      { type: String},
    is_truth:
      { type: Boolean },
    inbound:
      { type: Object },
    "inbound.sync_action":
      { type: [String]
      , allowedValues: _sync_actions_arr },
    "inbound.filter":
      { type: Object
      , blackbox: true
      , optional: true },
    outbound:
      { type: Object },
    "outbound.sync_action":
      { type: [String]
      , allowedValues: _sync_actions_arr },
    "outbound.filter":
      { type: Object
      , blackbox: true
      , optional: true },
    match:
      { type: Object
      , blackbox: true
      , optional: true }
});

VertifyProperties.schema = new SimpleSchema({
  tenant_id:
    { type: Number
    , optional: true },
  id:
    { type: Number
    , optional: true },
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
    { type: Number
    , optional: true },
  task_status:
    { type: String
    , optional: true },
  name:
    { type: String },
  friendly_name:
    { type: String },
  level:
    { type: Number },
  rules:
    { type: [VertifyPropertyRulesSchema]
    , optional: true },
  external_objects:
    { type: [VertifyPropertyExternalObjectsSchema]
    , optional: true }
});
