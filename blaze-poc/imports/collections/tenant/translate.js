import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Translates = new Mongo.Collection('translates');
export const Rows = new Mongo.Collection('translate_rows');

Translates.schema = new SimpleSchema({
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
  name:
    {type: String},
  column_1:
    {type: String},
  column_2:
    {type: String},
  column_3:
    {type: String},
  column_4:
    {type: String},
  column_5:
    {type: String},
  column_6:
    {type: String},
  column_7:
    {type: String},
  column_8:
    {type: String},
  column_9:
    {type: String},
  column_10:
    {type: String},
  rows:
    {type: [Object]}
});

Rows.schema = new SimpleSchema({
  value_1:
    {type: String},
  value_2:
    {type: String}
});
