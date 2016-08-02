import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Navitems = new Mongo.Collection('navitems');

Navitems.schema = new SimpleSchema({
  name:
    { type: String },
  shortdesc:
    { type: String },
  description:
    { type: String },
  order:
    { type: Number },
  route:
    { type: String
      , defaultValue: '/'},
  icon:
    { type: String
      , defaultValue: 'option-horizontal' },
  "subnavs.$.name":
    { type: String },
  "subnavs.$.shortdesc":
    { type: String },
  "subnavs.$.description":
    { type: String },
  "subnavs.$.order":
    { type: Number },
  "subnavs.$.route":
    { type: String
    , defaultValue: '/'},
  "subnavs.$.icon":
    { type: String
    , defaultValue: 'option-horizontal'},
  "subnavs.$.subnavs":
    { type: [Object]},
});
