import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Connectors = new Mongo.Collection('connectors');

Connectors.schema = new SimpleSchema({
  id:
    {type: String},
  modified:
    {type: Date},
  created:
    {type: Date},
  system_info_id:
    {type: String},
  version:
    {type: String},
  is_dynamic_wsdl:
    {type: Boolean},
  is_username_required:
    {type: Boolean},
  is_password_required:
    {type: Boolean},
  is_current_version:
    {type: Boolean},
  data_assembly:
    {type: String},
  md5_hash:
    {type: String},
  md5_data_hash:
    {type: String},
  assembly:
    { type: String},
  settings:
    { type: [String]}
});
