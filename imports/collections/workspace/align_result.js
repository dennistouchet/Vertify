import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const AlignResults = new Mongo.Collection('align_results');

Meteor.methods({
  'align_results.editApproval'(ws_id, ar_id, name, approved){
    check(ws_id, String);
    check(ar_id, String);

    var thisAr = AlignResults.findOne(ar_id,{"workspace_id": ws_id});
    //console.log("Workspace: " + ws_id + " | ARid: " + arid + " | name: " + name + " | approved: " + approved + "Align_Results:");
    //console.log(thisAr);

    if(thisAr){
      thisAr.alignment_properties.forEach(function(property){
        if(property.name == name){
          property.approved = approved;
          //console.log("Name: " + name + "Approved: " + approved);
          //console.log(property);
        }
      });
    }
    else{
      //throw error
      throw new Meteor.Error("Missing Value", "There was an error processing your request. The Align Results value does not exist.");
    }
    AlignResults.update(thisAr._id, {$set: {alignment_properties: thisAr.alignment_properties}});

  },
  'align_results.updateName'(ws_id, ar_id, name, friendlyname){
    check(ws_id, String);
    check(ar_id ,String);
    check(name ,String);
    check(friendlyname ,String);

    var thisAr = AlignResults.findOne(arid,{"workspace_id": ws_id});

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

    var _id = AlignResults.update(thisAr._id, {$set: {alignment_properties: thisAr.alignment_properties}});
    console.log("AlignResults update called | _id: " + _id);
  },
  'align_results.remove'(ws_id){
    check(ws_id, String);
    //TODO: import this remove with vertify object id
    console.log("align results remove running");
    var current = AlignResults.findOne({"workspace_id": ws_id});
    if(current)
      return AlignResults.remove({"workspace_id": ws_id});

    console.log(current);
    console.log("align results remove finished");
    //throw new Meteor.Error("Missing Value", "No Match Results found in Workspace: " + ws_id + " with ID: " + vo);
  },
})

export const AlignmentObjectField = new SimpleSchema({
    external_object_id:
      { type : Number },
    external_property_path:
      { type: String },
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
    , defaultValue: "exact" },
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
  tenant_id:
    { type: Number },
  modified:
    { type: Date},
  created:
    { type: Date },
  is_deleted:
    { type: Boolean
    , defaultValue: false },
  workspace_id:
    { type: String },
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
