import { Meteor } from 'meteor/meteor';

import { Navitems } from '../imports/collections/navitems.js';
import { Datas } from '../imports/collections/datas.js';

import { Connectors } from '../imports/collections/global/connectors.js';
import { ObjectsList } from '../imports/collections/global/object_list.js';
import { Tasks } from '../imports/collections/global/task.js';

import { Workspaces } from '../imports/collections/tenant/workspace.js';
import { Systems } from '../imports/collections/tenant/system.js';
import { ExternalObjects } from '../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../imports/collections/tenant/vertify_property.js';
import { Groups } from '../imports/collections/tenant/group.js';

import { MatchSetup } from '../imports/collections/tenant/match_setup.js';
//import {  } from '../imports/collections/tenant/.js';
import { MatchResults } from '../imports/collections/workspace/match_result.js';
import { MarketoLeadRecord } from '../imports/collections/workspace/marketo_lead_record.js';

Meteor.publish('navitems', function(){
  return Navitems.find({}, {
    sort: {order : 1,
          "subnavs.order" : 1 }
  });
});

Meteor.publish('datas', function(){
  return Datas.find();
});

Meteor.publish('systems', function(){
  return Systems.find();
});

Meteor.publish('external_objects', function(){
  return ExternalObjects.find();
});

Meteor.publish('match_setup', function(){
  return MatchSetup.find();
});

Meteor.publish('vertify_objects', function(){
  return VertifyObjects.find();
});

Meteor.publish('vertify_properties', function(){
  return VertifyProperties.find();
});

Meteor.publish('workspaces', function(){
  return Workspaces.find();
});

Meteor.publish('groups', function(){
  return Groups.find();
});

Meteor.publish('objects_list', function(){
  return ObjectsList.find();
});

Meteor.publish('connectors', function(){
  return Connectors.find();
});

Meteor.publish('tasks', function(){
  return Tasks.find();
});

Meteor.publish('match_results', function(){
  return MatchResults.find();
});

Meteor.publish('marketo_lead_record', function(){
  return MarketoLeadRecord.find({});
})
