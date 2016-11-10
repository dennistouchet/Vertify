import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const VertifyContact = new Mongo.Collection('vertify_contact');

VertifyContact.schema = new SimpleSchema({

  "metadata.$.id":
    { type: String },
  "metadata.$.created":
    { type: Date },
  "metadata.$.modified":
    { type: Date },
  "links.$.object_id":
    { type: String },
  "links.$.id":
    { type: String },
  "data.$.FirstName":
    { type: String },
  "data.$.LastName":
    { type: String },
  "data.$.Company":
    { type: String },
  "data.$.Email":
    { type: String },
  "data.$.Street":
    { type: String},
  "data.$.Zip":
    { type: String },
  "data.$.MainPhone":
    { type: String },
  "data.$.Url":
    { type: String },
  "data.$.MKLastModified":
    { type: String },
  "data.$.LeadScore":
    { type: String },
  "data.$.BehaviorScore":
    { type: String },
  "data.$.Price1":
    { type: String },
  "data.$.Price2":
    { type: String },
  "data.$.LeadStatus":
    { type: String },
  "data.$.Addresses.$.Street":
    { type: String },    
  "data.$.Addresses.$.Street2":
    { type: String },
  "data.$.Addresses.$.City":
    { type: String },
  "data.$.Addresses.$.State":
    { type: String },
  "data.$.Addresses.$.Zip":
    { type: String },
});
