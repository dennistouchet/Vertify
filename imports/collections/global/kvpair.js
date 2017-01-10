import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//TODO: THIS SHOULD BE MADE TO TAKE ANY OBJECT TYPE FOR VALUE
export const KVPairSchema = new SimpleSchema({
  key:
  { type: String },
  value:
  { type: String }
});
