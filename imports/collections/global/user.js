import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { KVPairSchema } from './kvpair.js';

//TODO: figure out why these won't run from this location
/*
Meteor.methods({
  'userEdit'(userId, options, config){
    check(options, Object);
    check(config, Object);
    console.log("todo: user edit");

    Meteor.users.update(userId, { $set: {"testVal": "todaysVal"}});
  },
  'userRemove'(userId){
    console.log("users.remove called with user: ", userId);

    return Meteor.users.remove(userId);
  }
});*/

export const PageState = new SimpleSchema({
  tab:
  { type: String },
  kv_fields:
  {
    //Currentl Only String
    type: [KVPairSchema],
    optional: true
  }
});

export const UserConfigurationSchema = new SimpleSchema({
    workspace:
    { type: String },
    route:
    { type: String },
    connect:
    { type: PageState
    , optional: true },
    collect:
    { type: PageState
    , optional: true },
    match:
    { type: PageState
    , optional: true },
    align:
    { type: PageState
    , optional: true }
});
