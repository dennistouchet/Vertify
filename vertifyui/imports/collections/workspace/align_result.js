import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const AlignResults = new Mongo.Collection('align_results');

Meteor.methods({
  'align_results.editApproval'(wsid, arid, name, approved){
    var thisAr = AlignResults.findOne(arid,{"workspace_id": wsid});

    if(thisAr){
      thisAr.alignment_properties.forEach(function(property){
        if(property.name == name){
          property.approved = approved;
          //break;
        }
      });
    }
    else{
      //throw error
      throw new Meteor.Error("Missing Value", "There was an error processing your request. The Align Results value does not exist.");
    }

    var id = AlignResults.update(thisAr._id, {$set: {alignment_properties: thisAr.alignment_properties}});
    console.log("AlignResults update called | id: " + id);
  },
  'align_results.updateName'(wsid, arid, name, friendlyname){

    var thisAr = AlignResults.findOne(arid,{"workspace_id": wsid});

    if(thisAr){
      thisAr.alignment_properties.forEach(function(property){
        if(property.name == name){
          property.friendly_name = friendlyname;
          //break;
        }
      });
    }
    else{
      //throw error
      throw new Meteor.Error("Missing Value", "There was an error processing your request. The Align Results Friendly Name value does not exist.");
    }

    var id = AlignResults.update(thisAr._id, {$set: {alignment_properties: thisAr.alignment_properties}});
    console.log("AlignResults update called | id: " + id);
  }
})

export const AlignmentObjectField = new SimpleSchema({
    external_object_id:
      { type : Number },
    external_property_path:
      { type: [String] },
    is_truth:
      { type: Boolean }
});

export const AlignmentVertifyField = new SimpleSchema({
  name:
    { type: String },
  friendly_name:
    { type: String
    , optional: true },
  align_method:
    { type: String
    , defaultValue: "Exact" },
  align_percent:
    { type: Number
    , defaultValue: 100 },
  approved:
    { type: Boolean
    , defaultValue: false },
  fields:
    { type: [AlignmentObjectField]}
});

AlignResults.schema = new SimpleSchema({
  id:
    { type: Number },
  modified:
    { type: Date},
  created:
    { type: Date },
  is_deleted:
    { type: Boolean
    , defaultValue: false },
  workspace_id:
    { type: Number },
  vertify_object_id:
    { type: Number },
  total:
    { type: Number },
  aligned:
    { type: Number },
  alignment_properties:
    { type: [AlignmentVertifyField]
    , min: 2 },
  approved:
    { type: Boolean
    , defaultValue: false },
  align_object:
    { type: Object
    , blackbox: true
    , optional: true }
});
