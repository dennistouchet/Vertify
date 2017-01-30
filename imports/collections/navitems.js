import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Navitems = new Mongo.Collection('navitems');

export const ChildItemsSchema = new SimpleSchema({
    name:
      { type: String },
    shortdesc:
      { type: String },
    description:
      { type: String },
    order:
      { type: Number },
    route:
      { type: String,
       defaultValue: '/'},
    icon:
      { type: String,
        defaultValue: 'option-horizontal' },
});

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
    { type: String,
      defaultValue: '/'},
  icon:
    { type: String,
      defaultValue: 'option-horizontal' },
  children:
    { type: [ ChildItemsSchema ],
      optional: true }
});
