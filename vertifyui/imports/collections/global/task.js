import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
  'tasks.insert'(t, ws_id, itemid){
    check(t , String);
    check(ws_id , String);
    check(itemid , Number);

    // Incrementing ID's
    var lastTask = Tasks.findOne({}, {sort: {id: -1}});
    var intId = null;
    if(lastTask == null) {
      intid = 111111;
    }
    else {
      intid = (lastTask.id + 1);
    }

    //TODO: replace with real tenant_id
    var tid = 100000;

    var newTasks = null;
    if(t == "authentication" || t == "discover" || t == "scan"){
      newTasks = {
        tenant_id: tid,
        id: intid,
        system_id: itemid,
        workspace_id: ws_id,
        task: t,
        created: new Date(),
        modified: new Date(),
        is_deleted: false
      }
    }else if(t == "collectschema" || t == "collect"){
      newTasks = {
        tenant_id: tid,
        id: intid,
        external_object_id: itemid,
        workspace_id: ws_id,
        task: t,
        created: new Date(),
        modified: new Date(),
        is_deleted: false,
        query_type: "All"
      }
    }else if(t == "matchtest" || t == "match"){
      //TODO: send sample size from match input
      newTasks = {
        tenant_id: tid,
        id: intid,
        vertify_object_id: itemid,
        workspace_id: ws_id,
        task: t,
        created: new Date(),
        modified: new Date(),
        is_deleted: false,
        match_options: { sample_size: 100 }
      }
    }else if(t == "aligntest"){
      //TODO: send sample size from align input
      newTasks = {
        tenant_id: tid,
        id: intid,
        vertify_object_id: itemid,
        workspace_id: ws_id,
        task: t,
        created: new Date(),
        modified: new Date(),
        is_deleted: false,
        align_options: { sample_size: 100}
      }
    }else if(t == "align"){
      newTasks = {
        tenant_id: tid,
        id: intid,
        vertify_object_id: itemid,
        workspace_id: ws_id,
        task: t,
        created: new Date(),
        modified: new Date(),
        is_deleted: false,
      }
    }else if(t == "analyze"){
      newTasks = {
        tenant_id: tid,
        id: intid,
        vertify_object_id: itemid,
        workspace_id: ws_id,
        task: t,
        created: new Date(),
        modified: new Date(),
        start: new Date(),
        end: new Date(),
        is_deleted: false,
      }
    }else if(t == "fixunmatched" || t == "fixissues"){
      newTasks = {
        tenant_id: tid,
        id: intid,
        vertify_object_id: itemid,
        workspace_id: ws_id,
        task: t,
        created: new Date(),
        modified: new Date(),
        start: new Date(),
        end: new Date(),
        is_deleted: false,
      }
    }else if(t == "sync"){
      //TODO: sync task
    }else if(t == "deleteexternalobject"){
      newTasks = {
        tenant_id: tid,
        id: intid,
        external_object_id: itemid,
        workspace_id: ws_id,
        task: t,
        created: new Date(),
        modified: new Date(),
        is_deleted: false,
      }
    }else if(t == "deletevertifyobject"){
      newTasks = {
        tenant_id: tid,
        id: intid,
        vertify_object_id: itemid,
        workspace_id: ws_id,
        task: t,
        created: new Date(),
        modified: new Date(),
        is_deleted: false
      }
    }

    Tasks.schema.validate(newTasks);
    Tasks.insert(newTasks);
  },
  'tasks.update'(id, ws_id){
    check(id, String);
    check(wisid, Number);
    var thisTask = Tasks.findOne(id, {"workspace_id": ws_id});

  },
  'tasks.remove'(id, ws_id){
    var thisTask = Tasks.findOne(id, {"workspace_id": ws_id});

  }
});

Tasks.schema = new SimpleSchema({
  tenant_id:
    { type: Number },
  id:
    { type: Number },
  modified:
    { type: Date
    , optional: true},
  created:
    { type: Date
    , optional: true },
  is_deleted:
    { type: Boolean
    , optional: true
    , defaultValue: false },
  start:
    { type: Date
    , optional: true },
  end:
    { type: Date
    , optional: true },
  task:
    { type: String
    , allowedValues: [ "authentication", "discover", "scan", "collectschema", "collect", "matchtest", "match", "aligntest", "align"
                      , "analyze", "fixunmatched", "fixissues", "sync"
                      , "deleteexternalobject" , "deletevertifyobject" ]
    },
  load:
    { type: String
    , optional: true },
  schedule_id:
    { type: String
    , optional: true },

  // ASSIGNMENT DATA
  engine_id:
    { type: String
    , optional: true },
  source_collect_task_id:
    { type: String
    , optional: true },
  target_collect_task_id:
    { type: String
    , optional: true },

  // STATUS INFO
  status:
    { type: String
    , allowedValues: [ 'queued', 'started', 'running', 'success', 'failed', 'terminated' ]
    , optional: true
    },
  percent_complete:
    { type: Number
    , optional: true
    , min: 0  },
  errors:
    { type: Number
    , optional: true
    , min: 0  },
  total_records:
    { type: Number
    , optional: true
    , min: 0  },
  records_processed:
    { type: Number
    , optional: true
    , min: 0  },
  records_with_errors:
    { type: Number
    , optional: true
    , min: 0  },
  records_converted:
    { type: Number
    , optional: true
    , min: 0  },
  records_moved:
    { type: Number
    , optional: true
    , min: 0 },

  // IDS FOR TASK PROCESSING
  workspace_id:
    { type: String },
  system_id:
    { type: Number
    , optional: true},
  external_object_id:
    { type: Number
    , optional: true },
  vertify_object_id:
    { type: Number
    , optional: true },
  source_object_id:
    { type: Number
    , optional: true },
  source_system_id:
    { type: Number
    , optional: true },

  // TASK OPTIONS
  query_type:
    { type: String
    , allowedValues: [ "All" ]
    , optional: true },
  collect_options:
    { type: [Object]
    , optional: true },
  match_options:
    { type: Object
    , optional: true
    , blackbox: true },
  align_options:
    { type: Object
    , optional: true
    , blackbox: true  },
  user_number:
    { type: Number
    , optional: true },
  max_concurrent_tasks:
    { type: Number
    , optional: true
    , min: 0 },
  reconvert:
    { type: String
    , optional: true },

});
