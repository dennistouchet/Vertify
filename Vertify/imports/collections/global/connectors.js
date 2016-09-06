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
  settings:
    { type: [ConnectorsSettingsSchema]
      , optional: true }
});
