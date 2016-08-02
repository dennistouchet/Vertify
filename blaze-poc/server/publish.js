import { Meteor } from 'meteor/meteor';

import { Navitems } from '../imports/collections/navitems.js';
import { Datas } from '../imports/collections/datas.js';

import { SystemInfos } from '../imports/collections/global/system_info.js';
import { ObjectsList } from '../imports/collections/global/object_list.js';
import { Tasks } from '../imports/collections/global/task.js';

import { Workspaces } from '../imports/collections/tenant/workspace.js';
import { Systems } from '../imports/collections/tenant/system.js';
import { Objects } from '../imports/collections/tenant/object.js';
import { Groups } from '../imports/collections/tenant/group.js';
import { SystemObjects } from '../imports/collections/tenant/system_object.js';
//import {  } from '../imports/collections/tenant/.js';

import { MarketoLeadRecord } from '../imports/collections/workspace/marketo_lead_record.js';

// Output to console on server (re)start
//console.log(Systems.find().fetch());
//console.log(Navitems.find().fetch());

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

Meteor.publish('objects', function(){
  return Objects.find();
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

Meteor.publish('system_objects', function(){
  return SystemObjects.find();
});

Meteor.publish('system_info', function(){
  return SystemInfos.find();
});

Meteor.publish('tasks', function(){
  return Tasks.find();
});

Meteor.publish('marketo_lead_record', function(){
  return MarketoLeadRecord.find({});
})
