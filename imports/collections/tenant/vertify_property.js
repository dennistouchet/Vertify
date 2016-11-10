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
  'vertify_properties.insertMultiple'(ws_id, vo){
    /*
    var ruleobj = {
      rule: alignProperty.align_method,
      external_property: alignProperty.fields[j]
    }

    var extobj = {
      external_object_id: alignProperty.
      property_group: 0,
      direction: "bidirectional",
      sync_action: "add_update",,
      is_truth: alignProperty.
    }*/
    console.log("Multiple Vertify property insert started.");
    console.log("Workspace _id: " + ws_id + " | Vertify Object id: " + vo);
    var alignResults = AlignResults.findOne({"workspace_id": ws_id,"vertify_object_id": vo});
    console.log("AlignResults:");
    console.log(alignResults);
    var Properties = [];

    alignResults.alignment_properties.forEach(function(alignproperty){
      if(alignproperty.approved){
        //console.log("inside align results to Vertify Property. align property:");
        //console.log(alignproperty);
        //TODO NEED TO ADD RULES

        var Fields = [];
        alignproperty.fields.forEach(function(field){
          var newField = {
            external_object_id: field.external_object_id,
            external_property_path: field.external_property_path,
            name: field.external_property_path,
            approved: true,
            is_truth: field.is_truth,
          }
          VertifyPropertyFieldsSchema.validate(newField);
          Fields.push(newField);
        });

        console.log("Fields created:");
        console.log(Fields);
        console.log("Starting Property creation...");

        var newProperty = {
          tenant_id: 100000,
          modified: new Date(),
          created: new Date(),
          is_deleted: false,
          workspace_id: ws_id,
          //TODO: change this once real Align results are created
          vertify_object_id: vo,//alignResults.vertify_object_id,
          parent_property_id: null,
          name: alignproperty.name,
          friendly_name: alignproperty.friendly_name,
          align: alignproperty.approved,
          align_method: alignproperty.align_method,
          level: 0,
          fields: Fields
        }
        Properties.push(newProperty);
      }
    });
    console.log("Properties created:");
    console.log(Properties);
    console.log("Starting properties insert...");
    vplist = [];
    Properties.forEach(function(vp){
      VertifyProperties.schema.validate(vp);
      var id = VertifyProperties.insert(vp);
      vplist.push(id);
    });
    console.log("List of VertifyProperties Created: ");
    console.log(vplist);
    return vplist;
  },
  'vertify_properties.edit'(){
    console.log("vertify_properties.edit function stub called.");
  },
  'vertify_properties.updateMultiple'(){
    console.log("vertify_properties.updateMultiple function stub called.");
  },
  'vertify_properties.removeMultiple'(ws_id, vo){
    var current = VertifyProperties.find({"vertify_object_id": vo, "workspace_id": ws_id});

    console.log("Vertify Properties remove: " + ws_id + " | void: " + vo);
    var count = 0;
    if(current){
      current.forEach(function(prop){
        VertifyProperties.remove(prop._id);
        count += 1;
      });
    }else {
      console.log("No Vertify Properties for the current Vertify Object");
    }
    return count;
  },
  'vertify_properties.remove'(_id){
    var current = VertifyProperties.findOne(_id);
    if(current)
      return VertifyProperties.remove(current._id);

    throw new Meteor.Error("Missing Value", "No Vertify Property with _id: " + _id);
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

VertifyPropertyFieldsSchema = new SimpleSchema({
    external_object_id:
      { type: Number },
    external_property_path:
      { type: String
      , optional: true },
    name:
      { type: String},
    approved:
      { type: Boolean
      , optional: true
      , defaultValue: false },
    is_truth:
      { type: Boolean },
    inbound:
      { type: Object
      , optional: true },
    "inbound.sync_action":
      { type: [String]
      , allowedValues: _sync_actions_arr },
    "inbound.filter":
      { type: Object
      , blackbox: true
      , optional: true },
    outbound:
      { type: Object
      , optional: true },
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
    { type: Number },
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
    { type: String },
  vertify_object_id:
    { type: Number },
  parent_property_id:
    { type: Number
    , optional: true },
  align:
    { type: Boolean
    , optional: true
    , defaultValue: false },
  align_method:
    { type: String },
  name:
    { type: String },
  friendly_name:
    { type: String },
  level:
    { type: Number },
  rules:
    { type: [VertifyPropertyRulesSchema]
    , optional: true },
  fields:
    { type: [VertifyPropertyFieldsSchema]
    , optional: true }
});