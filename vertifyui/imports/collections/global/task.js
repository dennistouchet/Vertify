import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
  'tasks.insert'(t, wsid, itemid){
    check(t , String);
    check(wsid , Number);
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

    var newTasks = null;
    if(t == "authentication" || t == "discover"){
      newTasks = {
        id: intid,
        system_id: itemid,
        workspace_id: wsid,
        task: t,
        created: new Date(),
        modified: new Date(),
        is_deleted: false
      }
    }else if(t == "collectschema" || t == "collect"){
      newTasks = {
        id: intid,
        external_object_id: itemid,
        workspace_id: wsid,
        task: t,
        created: new Date(),
        modified: new Date(),
        is_deleted: false
      }
    }else if(t == "matchtest" || t == "match"){
      newTasks = {
        id: intid,
        vertify_object_id: itemid,
        workspace_id: wsid,
        task: t,
        created: new Date(),
        modified: new Date(),
        is_deleted: false,
      }
    }else if(t == "aligntest" || t == "align"){
      newTasks = {
        id: intid,
        vertify_object_id: itemid,
        workspace_id: wsid,
        task: t,
        created: new Date(),
        modified: new Date(),
        is_deleted: false,
      }
    }else if(t == "analyze"){
      //TODO: analyze task
    }else if(t == "fix"){
      //TODO: analyze task
    }else if(t == "schedule"){
      //TODO: analyze task
    }

    Tasks.schema.validate(newTasks);
    Tasks.insert(newTasks);
  },
  'tasks.update'(id, wsid){
    check(id, String);
    check(wisid, Number);
    var thisTask = Tasks.findOne(id, {"workspace_id": wsid});

  },
  'tasks.remove'(id, wsid){
    var thisTask = Tasks.findOne(id, {"workspace_id": wsid});

  }
});

Tasks.schema = new SimpleSchema({
  tenant_id:
    { type: Number
    , optional: true },
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
    , allowedValues: [ "authentication", "discover", "collectschema", "collect", "matchtest", "match", "aligntest", "align"]
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
    { type: Number },
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
  collect_options:
    { type: [Object]
    , optional: true },
  match_options:
    { type: [Object]
    , optional: true },
  align_options:
    { type: [Object]
    , optional: true },
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
