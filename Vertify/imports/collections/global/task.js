import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
  'tasks.insert'(t, wsid, sysid){
    check(sysid , String);
    check(wsid , String);
    check(t , String);

    console.log("Task insert called");
    // Incrementing ID's
    var lastTask = Tasks.findOne({}, {sort: {id: -1}});
    var intId = null;
    if(lastTask == null) {
      intid = 111111;
    }
    else {
      intid = (parseInt(lastTask.id) + 111111);
    }

    var newTasks = {
      id: intid.toString(),
      system_id: sysid,
      workspace_id: wsid,
      task: t
    }

    Tasks.schema.validate(newTasks);
    Tasks.insert(newTasks);
  },
});

Tasks.schema = new SimpleSchema({
  tenant_id:
    { type: Number
    , optional: true },
  id:
    { type: String },
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
    { type: String },
  system_id:
    { type: String
    , optional: true},
  external_object_id:
    { type: String
    , optional: true },
  vertify_object_id:
    { type: String
    , optional: true },
  source_object_id:
    { type: String
    , optional: true },
  source_system_id:
    { type: String
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
