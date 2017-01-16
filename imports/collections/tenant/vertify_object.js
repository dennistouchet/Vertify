import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { ExternalObjects } from './external_object.js';

export const VertifyObjects = new Mongo.Collection('vertify_objects');

var operators = [ "eq", "gt", "gte", "lt", "lte", "in", "like", "isnull",  "between", "and", "or", "fuzzy", "not"];

Meteor.methods({
  'vertify_objects.insert'(MatchObject){
    var eoinbound = {
      sync_action: ["add", "update", "delete"],
      filter: null
    }
    VertifyObjectExternalObjectInboundSchema.validate(eoinbound);
    var eooutbound = {
      sync_action: ["add", "update", "delete"],
      filter: null
    }
    VertifyObjectExternalObjectOutboundSchema.validate(eooutbound);

    var matchfields = [{
      external_property: MatchObject.match_fields[0].field1,
      operator: "eq"
    },
    {
      external_property: MatchObject.match_fields[0].field2,
      operator: "eq",
    }]
    VertifyObjectMatchSchema.validate(matchfields[0]);
    VertifyObjectMatchSchema.validate(matchfields[1]);

    //TODO: CHANGE THIS, THIS SHOULD HAPPEN ON ELIXIR side
    //BEING DONE FOR HAPPY PATH
    var sys_ids = [];
    var eo = ExternalObjects.findOne(MatchObject.eo_ids[0],{"workspace_id": MatchObject.workspace_id});
    sys_ids.push(eo.system_id);
    eo = ExternalObjects.findOne(MatchObject.eo_ids[1],{"workspace_id": MatchObject.workspace_id});
    sys_ids.push(eo.system_id);

    var newExternalObjects = [{
      external_object_id: MatchObject.eo_ids[0],
      system_id: sys_ids[0],
      inbound: eoinbound,
      outbound: eooutbound,
      match: matchfields[0],
      approved: false,
    },
    {
      external_object_id: MatchObject.eo_ids[1],
      system_id: sys_ids[1],
      inbound: eoinbound,
      outbound: eooutbound,
      match: matchfields[1],
      approved: false
    }];

    for(i = 0; i < newExternalObjects.length; i++){
      newExternalObjects[i].is_truth = false;
      if(newExternalObjects[i].external_object_id == MatchObject.system_of_truth){
        newExternalObjects[i].is_truth = true;
      }
    }
    VertifyObjectExternalObjectsSchema.validate(newExternalObjects[0]);
    VertifyObjectExternalObjectsSchema.validate(newExternalObjects[1]);

    var newVertifyObject = {
      tenant_id: 100000,
      modified: new Date(),
      created: new Date(),
      is_deleted: false,
      name: MatchObject.vo_name,
      workspace_id: MatchObject.workspace_id,
      analyze_status: "disabled",
      external_objects: newExternalObjects
    };

    VertifyObjects.schema.validate(newVertifyObject);

    return VertifyObjects.insert(newVertifyObject);
  },
  'vertify_objects.updateApprovedStatus'(ws_id, vo_id, status){
    check(vo_id, String);
    check(ws_id, String);
    check(status, String);

    //TODO:  need to update by radio selection
    var vo = VertifyObjects.findOne(vo_id, {"workspace_id": ws_id});
    if(vo){
      vo.external_objects.forEach(function(eo){
        if(status == "approved"){
          eo.approved = true;
        }
        else{
          eo.approved = false;
        }
      })

    }
    else{
      throw new Meteor.Error("Vertify Object not Found", "The object with vo_id: " +  vo_id + " could not be found.");
    }

    vo.external_objects.forEach(function(eo){
      VertifyObjectExternalObjectsSchema.validate(eo);
    })

    return VertifyObjects.update(vo_id, {$set: {external_objects: vo.external_objects,}});
  },
  'vertify_objects.updateStatus'(ws_id, vo_id, field, status){
    check(ws_id, String);
    check(vo_id, String);
    check(field, String);
    check(status, Boolean);

    console.log("vo_id: " + vo_id + " | ws: " + ws_id + " | " + field + " | " + status);
    var vo = VertifyObjects.findOne(vo_id, {"workspace_id": ws_id});

    // Updates the status fields if status is true
    // Resets status field and all subsequent status fields if status is false
    if(field == 'matchtest'){
      console.log("update matchtest: " + vo._id);
      if(status){
        return VertifyObjects.update(vo._id,{$set: {matchtest: status }});
      }
      else{
        return VertifyObjects.update(vo._id,{$set: {matchtest: status, match: status, align: status, aligntest: status, analyze_status:"disabled", analyze_percentage: 0 }});
      }
    }
    else if(field == 'match'){
        console.log("update match: " + vo._id);
      if(status){
        return VertifyObjects.update(vo._id,{$set: {match: status }});
      }
      else{
        return VertifyObjects.update(vo._id,{$set: {match: status, align: status, aligntest: status, analyze_status:"disabled", analyze_percentage: 0 }});
      }
    }
    else if(field == 'align'){
      console.log("update align: " + vo._id);
      if(status){
        return VertifyObjects.update(vo._id,{$set: {align: status }});
      }
      else{
        return VertifyObjects.update(vo._id,{$set: {align: status, aligntest: status, analyze_status:"disabled", analyze_percentage: 0 }});
      }
    }
    else if(field == 'analyze'){
      return VertifyObjects.update(vo._id,
        {$set:
          {analyze_status: "disabled", analyze_percentage: 0 }
        });
    }
  },
  'vertify_objects.updateLoading'(id, percent){
    check(percent, Number);
    var current = VertifyObjects.findOne({"id": id});

    if(current){
      if(percent >= 100){
        VertifyObjects.update(current._id,
            { $set:
                { analyze_percentage: percent
                , analyze_status: "enabled" }
            }
        );
      }else{
        VertifyObjects.update(current._id,
            { $set:
                { analyze_percentage: percent
                , analyze_status: "analyzing" }
            }
        );
      }
    }
    else{
      throw new Meteor.Error("Vertify Object not Found", "The object with id: " +  id + " could not be found.");
    }
  },
  'vertify_objects.update'(ws_id, id){
    console.log("TODO: Complete VO update");
  },
  'vertify_objects.remove'(ws_id, vo_id){
    var current = VertifyObjects.findOne(vo_id, {"workspace_id": ws_id});
    if(current)
      return VertifyObjects.remove(current._id);

    throw new Meteor.Error("Missing Value", "No Vertify Object found in Workspace: " + ws_id + " with ID: " + vo_id);
  },
  'vertify_objects.removeAll'(ws_id){
    check(ws_id, String);
    return VertifyObjects.remove({"workspace_id": ws_id});
  }
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

export const VertifyObjectExternalObjectsSchema = new SimpleSchema({
  external_object_id:
    { type: String },
  system_id:
    { type: String },
  inbound:
    { type: VertifyObjectExternalObjectInboundSchema },
  outbound:
    { type: VertifyObjectExternalObjectOutboundSchema },
  match:
    { type: VertifyObjectMatchSchema
    , optional: true },
  approved:
    { type: Boolean },
  is_truth :
    { type: Boolean }
});

VertifyObjects.schema = new SimpleSchema({
  tenant_id:
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
  matchtest:
    { type: Boolean
    , optional: true
    , defaultValue: false },
  match:
    { type: Boolean
    , optional: true
    , defaultValue: false },
  aligntest:
    { type: Boolean
    , optional: true
    , defaultValue: false },
  align:
    { type: Boolean
    , optional: true
    , defaultValue: false },
  analyze_status:
    { type: String
    , defaultValue: "disabled"
    , allowedValues: [ "enabled", "analyzing", "disabled"] },
  analyze_percentage:
    { type: Number
    , min: 0
    , max: 100
    , defaultValue: 0
    , optional: true },
  fix:
    { type: Boolean
    , defaultValue: false
    , optional: true },
  external_objects:
    { type: [VertifyObjectExternalObjectsSchema] }
});
