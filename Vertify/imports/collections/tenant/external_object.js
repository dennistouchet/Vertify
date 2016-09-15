import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { VertifyObjects } from './vertify_object.js';

export const ExternalObjects = new Mongo.Collection('external_objects');
export const ExternalObjectProperties = new Mongo.Collection('external_object_properties');

Meteor.methods({
  'external_objects.insert'(wsid, sysid, n) {
    check(wsid, String);
    check(sysid, String);
    check(n, String);
    //check user is logged
    /*
    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    */
    var obj = ExternalObjects.findOne({}, {sort: {id: -1}});
    if(obj == null) {
      var newid = 1;
    }
    else {
      var newid = (obj.id + 1);
    }

    var objectExists = ExternalObjects.findOne({"system_id": sysid, "name": n})
    if(objectExists){
      throw new Meteor.Error("Duplicate Object", "There was an error inserting the External Object. The object already exists in the system.");
    }

    var newExternalObject = {
      tenant_id: parseInt(wsid),
      id: newid,
      modified: new Date(),
      created: new Date(),
      name: n,
      system_id: sysid,
      workspace_id: wsid
    };
    ExternalObjects.schema.validate(newExternalObject);
    ExternalObjects.insert(newExternalObject);

    return newid;
  },
  'external_objects.remove'(currentid, wsid){
    check(currentid, String)

    //TODO: Add userid security
    //TODO: verify object doesn't exist in map/align
    var objectCount = VertifyObjects.find({"workspace_id": wsid}).count();
    if(objectCount > 0){
      throw new Meteor.Error("Existing Dependencies", "There was an error deleting the External Object. All Vertify Objects must be deleted from a system before it can be removed.");
    }

    var current = ExternalObjects.findOne(currentid);

    ExternalObjects.remove(current._id);
  },
});


ExternalObjectProperties.schema = new SimpleSchema({
  name:
    { type: String },
  is_custom:
    { type: Boolean },
  is_array:
    { type: Boolean },
  external_type:
    { type: String
    ,  optional: true },
  type:
    { type: String },
  is_key:
    { type: Boolean }
});


ExternalObjects.schema = new SimpleSchema({
  tenant_id:
    { type: Number},
  id:
    { type: Number },
  modified:
    { type: Date },
  created:
    { type: Date },
  is_deleted:
    { type: Boolean
    , optional: true
    , defaultValue: false },
  name:
    { type: String },
  system_id:
    { type: String },
  workspace_id:
    { type: String },
  last_query:
    { type: Date
    , optional: true },
  page_size:
    { type: Number
    , optional: true },
  request_size:
    {type: Number
    , optional: true },
  record_count:
    { type: Number
    , optional: true
    , defaultValue: 100 },
  type:
    { type: String
    , optional: true  },
  properties:
    { type:  [ExternalObjectProperties.schema ]
    , optional: true },
  generic_integer_1:
    { type: Number
    , optional: true },
  generic_integer_2:
    { type: Number
    , optional: true },
  generic_integer_3:
    { type: Number
    , optional: true },
  generic_string_1:
    { type: String
    , optional: true },
  generic_string_2:
    { type: String
    , optional: true },
  generic_string_3:
    { type: String
    , optional: true },
  is_custom:
    { type: Boolean
    , optional: true },
  level:
    { type: String
    , optional: true },
  is_hidden:
    { type: Boolean
    , optional: true },
  last_modified_property_name:
    { type: String
    , optional: true },
  supports_add:
    { type: Boolean
    , optional: true },
  supports_update:
    { type: Boolean
    , optional: true },
  supports_delete:
    { type: Boolean
    , optional: true },
  supports_query:
    { type: Boolean
    , optional: true },
  supports_pagination:
    { type: Boolean
    , optional: true },
  supports_last_modified_query:
    { type: Boolean
    , optional: true },
  supports_collect_filters:
    { type: Boolean
    , optional: true },
  collect_filters:
    { type: String
    , optional: true },
});
