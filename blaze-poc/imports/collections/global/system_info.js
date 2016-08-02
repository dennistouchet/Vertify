import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const SystemInfos = new Mongo.Collection('system_infos');
//export const SystemInfosSettings = new Mongo.Collection('system_infos_settings');

SystemInfos.schema = new SimpleSchema({
  id:
    { type: String },
  modified:
    { type: Date },
  created:
    { type: Date },
  name:
    { type: String },
  namespace:
    { type: String },
  default_prefix:
    { type: String },
  requires_agent:
    { type: Boolean },
  tenant_id:
    { type: Number },
  "settings.$.name":
    { type: String
      , optional: true },
  "settings.$.type":
    { type: String
      , defaultValue: "string"
      , optional: true },
  "settings.$.is_encrypted":
    { type: Boolean
    , defaultValue: false
    , optional: true },
});

/*
SystemInfosSettings.schema = new SimpleSchema({
  name:
    {type: String},
  type:
    {type: String},
  is_encrypted:
    {type: Boolean}
});
*/
