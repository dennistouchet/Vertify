import { Meteor } from 'meteor/meteor';

import { Navitems } from '../imports/collections/navitems.js';
import { Datas } from '../imports/collections/datas.js';

import { Tenants } from '../imports/collections/global/tenant.js';
import { Connectors } from '../imports/collections/global/connector.js';
import { ObjectsList } from '../imports/collections/global/object_list.js';
import { Tasks } from '../imports/collections/global/task.js';
import { Versioning } from '../imports/collections/global/versioning.js';

import { Workspaces } from '../imports/collections/tenant/workspace.js';
import { Systems } from '../imports/collections/tenant/system.js';
import { ExternalObjects } from '../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../imports/collections/tenant/vertify_property.js';

import { MatchSetup } from '../imports/collections/tenant/match_setup.js';
import { MatchResults } from '../imports/collections/workspace/match_result.js';
import { AlignResults } from  '../imports/collections/workspace/align_result.js';
import { FixUnmatchedRecords } from '../imports/collections/workspace/unmatched_record.js';

import Tabular  from 'meteor/aldeed:tabular';
import { TabularTables } from '../lib/datalist.js';
let MDict = [];

Meteor.methods({
'publishMatchResults' : function(ws_id, name){
  console.log("Server dynamic publication called for: ",name);

  Meteor.publish(name, function(){
    console.log("Server MD", MDict[name]);
    options = {};//{ _suppressSameNameError: true };
    if(MDict[name] === 'undefined')
      MDict[name] = new Mongo.Collection(name, options);
    else {
      console.log("MDict[] value wasn't null");
    }
    if(MDict[name])
      return MDict[name].find({"workspace_id": ws_id});
  });
}
});

//TODO: RESTRICT THIS. RETURNS ALL USERS
Meteor.publish('users', function(){
  var groups = Roles.getGroupsForUser(this.userId);
  var isAdmin = Roles.userIsInRole(this.userId, ['admin','super-admin'], groups[0]);

  if(isAdmin){
    //TODO: filter by groups(tenants) and remove Roles.GLOBAL_GROUP
    return Meteor.users.find({});
  }
  return Meteor.users.find({_id: this.userId});
});

//TODO: RESTRICT THIS. RETURNS ONLY CERTAIN FIELDS
Meteor.publish('userdata', function(){
  return Meteor.users.find({_id: this.userId}, {fields: {config:1}});
});

Meteor.publish('roles', function(){
  var groups = Roles.getGroupsForUser(this.userId);
  var isAdmin = Roles.userIsInRole(this.userId, ['admin','super-admin'], groups[0]);

  if(isAdmin){
    //TODO: filter by groups(tenants) and remove Roles.GLOBAL_GROUP
    return Meteor.roles.find({});
  }
  //TODO: throw authorization error
  return;
});

Meteor.publish('tenants', function(){
  if(!this.userId){
    return;
  }
  return Tenants.find({});
});

Meteor.publish('workspaces', function(tnt_id){
  if(!this.userId){
    return;
  }
  if(typeof tnt_id === 'undefined'){
    console.log("no ten id");
    return Workspaces.find();
  }
  else{
    console.log("ten id found");
    return Workspaces.find({"tenant_id": tnt_id});
  }
});

Meteor.publish('systems', function(){
  if(!this.userId){
    return;
  }
  return Systems.find();
});

Meteor.publish('external_objects', function(){
  if(!this.userId){
    return;
  }
  return ExternalObjects.find();
});

Meteor.publish('match_setup', function(){
  if(!this.userId){
    return;
  }
  return MatchSetup.find();
});

Meteor.publish('vertify_objects', function(){
  if(!this.userId){
    return;
  }
  return VertifyObjects.find();
});

Meteor.publish('vertify_properties', function(){
  if(!this.userId){
    return;
  }
  return VertifyProperties.find();
});

Meteor.publish('objects_list', function(){
  if(!this.userId){
    return;
  }
  return ObjectsList.find();
});

Meteor.publish('connectors', function(){
  if(!this.userId){
    return;
  }
  return Connectors.find();
});

Meteor.publish('tasks', function(){
  if(!this.userId){
    return;
  }
  return Tasks.find();
});

Meteor.publish('match_results', function(){
  if(!this.userId){
    return;
  }
  return MatchResults.find();
});

Meteor.publish('align_results', function(){
  if(!this.userId){
    return;
  }
  return AlignResults.find();
});

Meteor.publish('fix_unmatched_records', function(){
  if(!this.userId){
    return;
  }
  return FixUnmatchedRecords.find({});
});

Meteor.publish('versioning', function(){
  return Versioning.find();
});

Meteor.publish('navitems', function(){
  return Navitems.find({}, {
    sort: {order : 1,
          "subnavs.order" : 1 }
  });
});

Meteor.publish('datas', function(){
  if(!this.userId){
    return;
  }
  return Datas.find();
});
