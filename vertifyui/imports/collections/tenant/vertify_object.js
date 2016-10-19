import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

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

    //TODO Create Vertify Properties here?
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

    var newExternalObjects = [{
      external_object_id: MatchObject.eo_ids[0],
      inbound: eoinbound,
      outbound: eooutbound,
      match: matchfields[0],
      approved: false,
    },
    {
      external_object_id: MatchObject.eo_ids[1],
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

    var obj = VertifyObjects.findOne({}, {sort: {id: -1}});
    if(obj == null) {
      var newid = 1;
    }
    else {
      var newid = (obj.id + 1);
    }

    var newVertifyObject = {
      tenant_id: 000000,
      id: newid,
      modified: new Date(),
      created: new Date(),
      is_deleted: false,
      name: MatchObject.vo_name,
      workspace_id: MatchObject.workspace_id,
      analyze_status: "Disabled",
      external_objects: newExternalObjects
    };

    VertifyObjects.schema.validate(newVertifyObject);
    VertifyObjects.insert(newVertifyObject);

    return newid;
  },
  'vertify_objects.updateApprovedStatus'(id, wsid, status){
    check(id, String);
    check(wsid, Number);
    check(status, String);

    var vo = VertifyObjects.findOne(id, {"workspace_id": wsid});
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
      //throw error
    }

    vo.external_objects.forEach(function(eo){
      VertifyObjectExternalObjectsSchema.validate(eo);
    })
    VertifyObjects.update(id, {$set: {external_objects: vo.external_objects}});

    return vo.id;
  },
  'vertify_objects.updateLoading'(id, percent){
    check(percent, Number);
    var current = VertifyObjects.findOne({"id": id});

    if(current){
      if(percent >= 100){
        VertifyObjects.update(current._id,
            { $set:
                { analyze_percentage: percent
                , analyze_status: "Enabled" }
            }
        );
      }else{
        VertifyObjects.update(current._id,
            { $set:
                { analyze_percentage: percent
                , analyze_status: "Analyzing" }
            }
        );
      }
    }
    else{
      throw new Meteor.Error("Vertify Object not Found", "The object with id: " +  id + " could not be found.");
    }
  },
  'vertify_objects.edit'(id,wsid){
    console.log("TODO: Complete VO edit");
  },
  'vertify_objects.remove'(id, wsid){
    var current = VertifyObjects.findOne(id, {"workspace_id": wsid});
    VertifyObjects.remove(current._id);
  },
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
    { type: Number },
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
    { type: Number },
  id:
    { type: Number },
  modified:
    { type: Date },
  created:
    { type: Date },
  is_deleted:
    { type: Boolean },
  name:
    { type: String },
  workspace_id:
    { type: Number },
  status_match:
    { type: Boolean
    , optional: true
    , defaultValue: false },
  status_align:
    { type: Boolean
    , optional: true
    , defaultValue: false },
  analyze_status:
    { type: String
    , defaultValue: "disabled"
    , allowedValues: [ "Enabled", "Analyzing", "Disabled"] },
  analyze_percentage:
    { type: Number
    , min: 0
    , max: 100
    , defaultValue: 0
    , optional: true },
  external_objects:
    { type: [VertifyObjectExternalObjectsSchema] }
});
