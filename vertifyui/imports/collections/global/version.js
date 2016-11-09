import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Version = new Mongo.Collection('version');

Version.schema = new SimpleSchema({
  created:
    {type: Date},
  version:
    {type: String}
});
