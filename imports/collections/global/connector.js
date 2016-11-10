import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Connectors = new Mongo.Collection('connectors');

export const ConnectorsSettingsSchema = new SimpleSchema({
    name:
    { type: String },
    value:
    { type: String },
    is_encrypted:
    { type: Boolean
    , defaultValue: false }
});

Connectors.schema = new SimpleSchema({
  id:
    { type: Number },
  modified:
    { type: Date },
  created:
    { type: Date },
  name:
    { type: String },
  default_prefix:
    { type: String },
  system_info_id:
    {type: String
    , optional: true},
  version:
    {type: String
      , optional: true},
  is_dynamic_wsdl:
    {type: Boolean
    , optional: true},
  is_username_required:
    {type: Boolean
    , optional: true},
  is_password_required:
    {type: Boolean
    , optional: true},
  is_current_version:
    {type: Boolean
    , optional: true},
  md5_hash:
    {type: String
    , optional: true},
  md5_data_hash:
    {type: String
    , optional: true},
  data_assembly:
    {type: String
    , optional: true},
  assembly:
    { type: String
    , optional: true},
  connector_runner_path:
    { type: String },
  settings:
    { type: [ConnectorsSettingsSchema]},
});
