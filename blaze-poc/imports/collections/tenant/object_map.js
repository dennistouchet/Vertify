import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const ObjectMaps = new Mongo.Collection('object_maps');
export const PropertyMaps = new Mongo.Collection('object_map_property_maps');
export const Transformations = new Mongo.Collection('object_map_transformations');
export const Conditions = new Mongo.collection('object_map_conditions');

  //TODO: Define this with Art
ObjectMaps.schema = new SimpleSchema({
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
  name:
    { type: String },
  source_object_id:
    { type: String },
  target_object_id:
    { type: String },
  records_moved:
    { type: [String] },
  records_to_move:
    { type: [String] },
  records_with_errors:
    { type: [String] },
  records_converted:
    { type: [String] },
  match_records:
    { type: Boolean },
  match_rule_id:
    { type: String },
  // This should always be a set of PropertyMaps Type
  //TODO: Fix Property Maps to use array field (i.e. "property_maps.$.")
  property_maps:
    { type: [Object] },

});

PropertyMaps.schema = new SimpleSchema({
  property_map_type:
    { type: String },
  name:
    { type: String },
  group_source_property:
    { type: String },
  target_property:
    { type: String },
  property_maps:
    { type: [Object] },
  transformations:
    { type: [Object] }
});

Transformations.schema = new SimpleSchema({
  rule:
    { type: String },
  conditions:
    { type: [Object] }
});

Conditions.schema = new SimpleSchema({
  source_property:
    { type: String },
  operator:
    { type: String }
});
