import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
  'tasks.insert'(i, sysid, wsid, t, s){
    check(i , String);
    check(sysid , String);
    check(wsid , String);
    check(t , String);
    check(s , String);

    var newTasks = {
      id: i,
      system_id: sysid,
      workspace_id: wsid,
      type: t,
      status: s
    }

    Tasks.schema.validate(newTasks);
    Tasks.insert(newTasks);
  },
});

Tasks.attachSchema (new SimpleSchema({
  tenant_id:
    { type: Number },
  id:
    { type: String },
  modified:
    { type: Date },
  created:
    { type: Date },
  is_deleted:
    { type: Boolean
    , optional: true
    , defaultValue: false },
  start:
    { type: Date },
  end:
    { type: Date },
  task:
    { type: String
    , allowedValues: [ "authentication", "discover", "collectschema", "collect", "match", "align"]
    },
  load:
    { type: String
    , optional: true },
  schedule_id:
    { type: String
    , optional: true },

  // ASSIGNMENT DATA
  engine_id:
    { type: String },
  source_collect_task_id:
    { type: String },
  target_collect_task_id:
    { type: String },

  // STATUS INFO
  status:
    { type: String
    , allowedValues: [ 'queued', 'started', 'running', 'success', 'failed', 'terminated' ]
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
    { type: String
    , optional: true},
  object_id:
    { type: String
    , optional: true },
  object_map_id:
    { type: String
    , optional: true },
  source_object_id:
    { type: String
    , optional: true },
  source_system_id:
    { type: String
    , optional: true },

  // TASK OPTIONS
  type:
    { type: String },
  collect_options:
    { type: String
    , optional: true },
  match_options:
    { type: String
    , optional: true },
  align_options:
    { type: String
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

}));
