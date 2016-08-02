import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const ObjectsList = new Mongo.Collection('objects_list');

ObjectsList.schema = new SimpleSchema({

  id: { type: Number },
  connector_id: { type: String },
  name: { type: String },
 
});
