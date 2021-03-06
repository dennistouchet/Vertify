import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Versioning = new Mongo.Collection('versioning');

Versioning.schema = new SimpleSchema({
  created:
    {type: Date},
  meteor:
    {type: String},
  elixir:
    {type: String,
    optional: true},
  runner:
    {type: String,
    optional: true}

});
