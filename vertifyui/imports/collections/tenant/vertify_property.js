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

    //TODO: ADD Vertify Object ID and Workspace ID to filter once alignresults are actually being created
    var alignResults = AlignResults.findOne({});//"workspace_id": ws});//,"vertify_object_id": vo});
    var Properties = [];

    alignResults.alignment_properties.forEach(function(alignproperty){
      if(alignproperty.approved){
        console.log("inside align results to vp. align property:");
        console.log(alignproperty);

        //TODO NEED TO ADD RULES

        var ExtObjs = [];
        alignproperty.fields.forEach(function(field){
          var newExtObj = {
            external_object_id: field.external_object_id,
            external_property_path: field.external_property_path,
            name: field.external_property_path[0],
            approved: true,
            is_truth: field.is_truth,
          }
          VertifyPropertyExternalObjectsSchema.validate(newExtObj);
          ExtObjs.push(newExtObj);
        });

        var newProperty = {
          tenant_id: 100000,
          modified: new Date(),
          created: new Date(),
          is_deleted: false,
          workspace_id: ws,
          //TODO: change this once real Align results are created
          vertify_object_id: vo,//alignResults.vertify_object_id,
          parent_property_id: null,
          name: alignproperty.name,
          friendly_name: alignproperty.name,
          friendly_name: alignproperty.friendly_name,
          align: alignproperty.approved,
          level: 0,
          external_objects: ExtObjs
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
  'vertify_properties.updateMultiple'(){
    console.log("vertify_properties.updateMultiple function stub called.");
  },
  'vertify_properties.removeMultiple'(wsid, vo){
    var current = VertifyProperties.find({"vertify_object_id": vo, "workspace_id": wsid});

    console.log("Vertify Properties remove: " + wsid + " | void: " + vo);
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
    { type: Number },
  vertify_object_id:
    { type: Number },
  parent_property_id:
    { type: Number
    , optional: true },
  align:
    { type: Boolean
    , optional: true
    , defaultValue: false },
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
