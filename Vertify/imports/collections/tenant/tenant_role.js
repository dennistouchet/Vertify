import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const TenantRoles = new Mongo.Collection('tenant_roles');

TenantRoles.schema = new SimpleSchema({
  tenant_id:
    { type: Number },
  id:
    { type: String },
  modified:
    { type: Date },
  created:
    { type: Date },
  is_deleted:
    { type: Boolean },
  permissions:
    { type: [String] },
  workspaces:
    { type: [String] }
});
