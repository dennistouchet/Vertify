import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Objects = new Mongo.Collection('objects');
export const ObjectProperties = new Mongo.Collection('object_properties')
Meteor.methods({
  'objects.insert'(wsid, sysid, objid, n) {
    check(wsid, String);
    check(sysid, String);
    check(objid, Number);
    check(n, String);
    //check user is logged
    /*
    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    */
    var obj = Objects.findOne({}, {sort: {id: -1}});
    if(obj == null) {
      var newid = 1;
    }
    else {
      var newid = (obj.id + 1);
    }

    var newObject = {
      tenant_id: parseInt(wsid),
      id: newid,
      modified: new Date(),
      created: new Date(),
      name: n,
      object_id: objid,
      system_id: sysid,
      workspace_id: wsid
    };
    Objects.schema.validate(newObject);
    //TODO: verify object doesn't exist for system
    //TODO: Make sure name is unique
    Objects.insert(newObject);
  },
  'objects.remove'(currentid){
    check(currentid, String)

    var current = Objects.findOne(currentid);

    //TODO: Add userid security
    //TODO: verify object doesn't exist in map/align
    /*
      var obj = ObjectMaps.findOne({"object_id": current.id});
      if(obj == null)
      {
        Objects.remove(current._id);
      }
    */
    Objects.remove(current._id);
  },
});

Objects.schema = new SimpleSchema({
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
  object_id:
    { type: Number },
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
  "properties.$.name":
    { type: String
    , optional: true  },
  "properties.$.is_custom":
    { type: Boolean
    , optional: true  },
  "properties.$.is_array":
    { type: Boolean
    , optional: true  },
  "properties.$.type":
    { type: String
    , optional: true  },
  "properties.$.is_key":
    { type: Boolean
    , optional: true },
  "properties.$.properties.$.name":
    { type: String
    , optional: true },
  "properties.$.properties.$.is_custom":
    { type: Boolean
    , optional: true },
  "properties.$.properties.$.is_array":
    { type: Boolean
    , optional: true },
  "properties.$.properties.$.type":
    { type: String
    , optional: true }  ,
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

//
ObjectProperties.schema = new SimpleSchema({
  name:
    {type: String},
  is_custome:
    {type: Boolean},
  is_array:
    {type: Boolean},
  type:
    {type: String},
  is_key:
    {type: Boolean},
  properties:
    {type: [Object]}
});
