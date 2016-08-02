import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const VertifyObjects = new Mongo.Collection('vertify_objects');
export const VertifyProperties = new Mongo.Collection('vertify_objects_vertify_property');

VertifyObjects.schema = new SimpleSchema({
  tenant_id:
    {type: Number},
  id:
    {type: String},
  modified:
    {type: Date},
  created:
    {type: Date},
  is_deleted:
    {type: Boolean},
  workspace_id:
    {type: String},
  truth_object_id:
    {type: String},
  //TODO: Define this with Art
  objects:
    {type: [Object]},
  properties:
    {type: [Object]}
});

VertifyProperties.schema = new SimpleSchema({
  name:
    {type: String},
  type:
    {type: String},
  truth_object_id:
    {type: String},
  truth_property:
    {type: String},
  alignment:
    {type: [Object]}
});
