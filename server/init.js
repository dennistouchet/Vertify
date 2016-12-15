//Meteor Imports
import { Meteor } from 'meteor/meteor';
//General Collection Imports
import { Navitems } from '../imports/collections/navitems.js';
import { Datas } from '../imports/collections/datas';
// Tenant Collection Imports
import { Workspaces } from '../imports/collections/tenant/workspace.js';
import { Systems, SystemExternalObjectsSchema, SystemSettingsSchema } from '../imports/collections/tenant/system.js';
import { ExternalObjects, ExternalObjectProperties } from '../imports/collections/tenant/external_object.js';
import { MatchSetup } from '../imports/collections/tenant/match_setup.js';
import { VertifyObjects, VertifyObjectExternalObjectsSchema
       , VertifyObjectMatchGroupSchema, VertifyObjectMatchSchema
       , VertifyObjectExternalObjectInboundSchema
       , VertifyObjectExternalObjectOutboundSchema }
         from '../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../imports/collections/tenant/vertify_property.js';
// Global Collection Imports
import { Versioning } from '../imports/collections/global/versioning.js';
import { Tasks } from '../imports/collections/global/task.js';
import { Connectors, ConnectorsSettingsSchema } from '../imports/collections/global/connector.js';
import { ObjectsList } from '../imports/collections/global/object_list.js';
// Workspace Collection Imports
import { MatchResults, MatchResultsExternalObjectsSchema } from '../imports/collections/workspace/match_result.js';
import { AlignResults, AlignmentVertifyField, AlignmentObjectField } from '../imports/collections/workspace/align_result.js';
import { MarketoLeadRecord } from '../imports/collections/workspace/marketo_lead_record.js';

Meteor.startup(function(){

  // Kadira Performance Monitoring
  var run_monitoring = Meteor.settings.run_monitoring;
  if(run_monitoring){
    console.log("Application Monitoring turned on");
    var app_id = Meteor.settings.app_id;
    var app_secret = Meteor.settings.app_secret;
    Kadira.connect(app_id, app_secret);
  }else{
    console.log("Application Monitoring turned off");
  }
  //GLOBAL MOCK WORKSPACES
  var ArtsWs = "";
  var JimsWs = "";
  var ShaunsWs = "";

  // Remove all collections in development environment when set to true
  var clearCollections = false;
  if( Meteor.isDevelopment && clearCollections) {
    deleteAllCollections();
  }

  initDatas();
  initNavitems();
  initVersioning();
  initWorkspaces();
  initConnectors();
  //TODO:: FIX MOCK DATA FOR DEMO PURPOSES
  /*
  initTasks();
  initSystems();
  initExternalObjects();
  initVertifyObjects();
  initVertifyProperties();
  initMatchResults();
  initAlignResults();
  */
});

function deleteAllCollections(){
  var beforeCount = 0;
  var afterCount = 0;
  // Tenant collections
  beforeCount = Workspaces.find().count();
  Workspaces.remove({});
  afterCount = Workspaces.find().count();
  console.log("Workspaces collection deleted (" + (beforeCount - afterCount) + " rows)");

  beforeCount = Systems.find().count();
  Systems.remove({});
  afterCount = Systems.find().count();
  console.log("Systems collection deleted (" + (beforeCount - afterCount) + " rows)");

  beforeCount = ExternalObjects.find().count();
  ExternalObjects.remove({});
  afterCount = ExternalObjects.find().count();
  console.log("ExternalObjects collectiondeleted (" + (beforeCount - afterCount) + " rows)");

  beforeCount = MatchSetup.find().count();
  MatchSetup.remove({});
  afterCount = MatchSetup.find().count();
  console.log("MatchSetup collection deleted (" + (beforeCount - afterCount) + " rows)");

  beforeCount = VertifyObjects.find().count();
  VertifyObjects.remove({});
  afterCount = VertifyObjects.find().count();
  console.log("VertifyObject collection deleted (" + (beforeCount - afterCount) + " rows)");

  beforeCount = VertifyProperties.find().count();
  VertifyProperties.remove({});
  afterCount = VertifyProperties.find().count();
  console.log("VertifyProperties collection deleted (" + (beforeCount - afterCount) + " rows)");

  // Global collections
  beforeCount = Versioning.find().count();
  Versioning.remove({});
  afterCount = Versioning.find().count();
  console.log("Versioning collection deleted (" + (beforeCount - afterCount) + " rows)");

  beforeCount = Tasks.find().count();
  Tasks.remove({});
  afterCount = Tasks.find().count();
  console.log("Tasks collection deleted (" + (beforeCount - afterCount) + " rows)");

  beforeCount = Connectors.find().count();
  Connectors.remove({});
  afterCount = Connectors.find().count();
  console.log("Connectors collection deleted (" + (beforeCount - afterCount) + " rows)");

  beforeCount = ObjectsList.find().count();
  ObjectsList.remove({});
  afterCount = ObjectsList.find().count();
  console.log("ObjectsList collection deleted (" + (beforeCount - afterCount) + " rows)");
  // Workspace collections

  beforeCount = MatchResults.find().count();
  MatchResults.remove({});
  afterCount = MatchResults.find().count();
  console.log("MatchResults collection deleted (" + (beforeCount - afterCount) + " rows)");

  beforeCount = AlignResults.find().count();
  AlignResults.remove({});
  afterCount = AlignResults.find().count();
  console.log("AlignResults collection deleted (" + (beforeCount - afterCount) + " rows)");


  beforeCount = MarketoLeadRecord.find().count();
  MarketoLeadRecord.remove({});
  afterCount = MarketoLeadRecord.find().count();
  console.log("MarketoLeadRecord collection deleted (" + (beforeCount - afterCount) + " rows)");

  //Other Collections
  beforeCount = Navitems.find().count();
  Navitems.remove({});
  afterCount = Navitems.find().count();
  console.log("Navitems collection deleted (" + (beforeCount - afterCount) + " rows)");
}

function initDatas(){

  var Deets = {
    name: 'deets',
    number: 1111,
    email: 'test1email1@email1.com',
    description: 'deets description'
  }

  var Deeters = {
    name: 'deeters',
    number: 2222,
    email: 'est2email2@email2.com',
    description: 'deeters description'
  }

  //TODO: FIX SCHEMA
  //Datas.schema.validate(Deets);
  //Datas.schema.validate(Deeters);
  if (! Datas.findOne()){
    var datas = [ Deets,
    Deeters
    ];
    datas.forEach(function (deet) {
      Datas.insert(deet);
    })
  }
};

function initNavitems(){

  // create navigation objects
  var Dashboard = {
    name: 'Dashboard',
    shortdesc: '',
    description: 'The Dashboard is quick visualization of the status and details of your Vertify Workspace.',
    order: 1,
    route: '/',
    icon: 'glyphicon-dashboard',
    subnavs: []
  }

  var Setup = {
    name: 'Setup',
    shortdesc: '',
    description: 'The Setup process allows you to connect to you systems and then collect, configure, and Vertify your data.',
    order:2,
    route: '/setup',
    icon: 'glyphicon-wrench',
    subnavs: [{
          name: 'Connect',
          shortdesc: 'Connect to your Systems',
          subnavs: [],
          description: 'Connect two or more systems to Vertify that contain data you wish to manage.',
          order: 1,
          route: '/setup/connect',
          icon: 'glyphicon-link'
        },
        {
          name: 'Collect',
          shortdesc: 'Collect your Data',
          subnavs: [],
          description: 'Choose the objects you wish to manage from each system and collect the data into Vertify.',
          order: 2,
          route: '/setup/collect',
          icon: 'glyphicon-cloud-download'
        },
        /*{
          name: 'Create',
          shortdesc: 'Create Vertify Objects',
          subnavs: [],
          description: 'Create Vertify objects and determine the which System Objects dictate truth',
          order: 2,
          route: '/setup/create',
          icon: 'glyphicon-sort-by-attributes'
        },*/
        {
          name: 'Match',
          shortdesc: 'Match Records',
          subnavs: [],
          description: 'Create Vertify objects to match collected records between objects from different systems.',
          order: 3,
          route: '/setup/match',
          icon: 'glyphicon-resize-small'
        },
        {
          name: 'Align',
          shortdesc: 'Align Data Fields',
          subnavs: [],
          description: 'Align the fields between matched records and establish system of truth for each field.',
          order: 4,
          route: '/setup/align',
          icon: 'glyphicon-random'
        }]
  }

  var Data = {
    name: 'Data',
    shortdesc: '',
    description: 'Allows you to resolve any issues in your data, and setup how and when you sync your data.',
    order: 3,
    route: '/data',
    icon: 'glyphicon-cloud',
    subnavs: [{
          name: 'Analyze',
          shortdesc: '',
          subnavs: [],
          description: 'Enable real-type analysis of your data to keep track of any issues.',
          order: 1,
          route: '/data/analyze',
          icon: 'glyphicon-warning-sign'
        },
        {
          name: 'Fix',
          shortdesc: '',
          subnavs: [],
          description: 'Allows you to resolve any issues in your Vertify objects.',
          order: 2,
          route: '/data/fix',
          icon: 'glyphicon-stats'
        },
        {
          name: 'Sync',
          shortdesc: '',
          subnavs: [],
          description: 'Allows you to configure when and how your data is processed.',
          order: 3,
          route: '/data/sync',
          icon: 'glyphicon-transfer'
        },
        {
          name: 'Schedule',
          shortdesc: '',
          subnavs: [],
          description: 'This is the Schedule description',
          order: 4,
          route: '/data/schedule',
          icon: 'glyphicon-calendar'
        },
        {
          name: 'Search',
          shortdesc: '',
          subnavs: [],
          description: 'This is the Search description',
          order: 5,
          route: '/data/search',
          icon: 'glyphicon-search'
        }]
  }

  var Admin = {
    name: 'Admin',
    shortdesc: '',
    description: 'The Admin section contains tools to setup and configure your Vertify instance.',
    order: 4,
    route: '/admin',
    icon: 'glyphicon-cog',
    subnavs: [{
          name: 'Workspaces',
          shortdesc: '',
          subnavs: [],
          description: 'Allows your to create and manage your individual Vertify Workspaces',
          order: 1,
          route: '/admin/workspaces',
          icon: 'glyphicon-tasks'
        },
        {
          name: 'Users',
          shortdesc: '',
          subnavs: [],
          description: 'This is the Users description',
          order: 2,
          route: '/admin/users',
          icon: 'glyphicon-user'
        },
        {
          name: 'Groups',
          shortdesc: '',
          subnavs: [],
          description: 'This is the Groups description',
          order: 3,
          route: '/admin/groups',
          icon: 'glyphicon-align-center'
        },
        {
          name: 'Agents',
          shortdesc: '',
          subnavs: [],
          description: 'This is the Agents description',
          order: 4,
          route: '/admin/agents',
          icon: 'glyphicon-pawn'
        }]
  }

  Navitems.schema.validate(Dashboard);
  Navitems.schema.validate(Setup);
  Navitems.schema.validate(Data);
  Navitems.schema.validate(Admin);

  if (! Navitems.findOne()){
    var navitems = [ Dashboard, Setup, Data, Admin ];
    navitems.forEach(function (navitem) {
      Navitems.insert(navitem);
    })
  }
}

function initVersioning(){

    // TODO: this can probably be done more efficiently
    // think about better ways to do this.
    const dir = '../../../../../.git/refs/tags/';

    const fs = require('fs');
    fs.readdir(dir, Meteor.bindEnvironment(
      function(err, files){
        if(err){
          console.log(err);
        }
        else{
            files.forEach(function(file){
              fs.stat(dir + file, Meteor.bindEnvironment(
              function (err, stats){
                if(err){
                  console.log(err);
                }
                else{
                  var tag = {meteor: file, created: stats.birthtime };
                  var exists = Versioning.findOne({meteor: file});
                  if(!exists){
                    Versioning.schema.validate(tag);
                    console.log("New version update. Versioning id: " +  Versioning.insert(tag));
                   }
                }
              }));
          });
        }
    }));
}

function initWorkspaces(){
  var ArtsWorkspace = {
    tenant_id: 100000,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    is_archived: false,
    name: "Art's Workspace",
    group_id: 100000
  };

  var JimsWorkspace = {
    tenant_id: 100000,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    is_archived: false,
    name: "Jim's Workspace",
    group_id: 100000
  };

  var ShaunsWorkspace = {
    tenant_id: 100000,
    modified: new Date("2015-07-04T20:06:08.310Z"),
    created: new Date("2015-07-04T20:06:08.310Z"),
    is_deleted: true,
    is_archived: true,
    name: "Shaun's Workspace",
    group_id: 100000
  };

  Workspaces.schema.validate(ArtsWorkspace);
  Workspaces.schema.validate(JimsWorkspace);
  Workspaces.schema.validate(ShaunsWorkspace);
  if(! Workspaces.findOne()){
    /*var workspaces = [ ArtsWorkspace, JimsWorkspace, ShaunsWorkspace ];
    workspaces.forEach(function (workspace) {
      Workspaces.insert(workspace);
    })*/
    ArtsWs = Workspaces.insert(ArtsWorkspace);
    JimsWs = Workspaces.insert(JimsWorkspace);
    ShaunsWs = Workspaces.insert(ShaunsWorkspace);
  }
};

function initConnectors() {
  //Marketo
  var ConnectorsSettings1 = [
    {
      name: "username",
      value: "username",
      is_encrypted: false
    },
    {
      name: "EncryptionKey",
      value: "EncryptionKey",
      is_encrypted: false
    },
    {
      name: "EndpointSubdomain",
      value: "EndpointSubdomain",
      is_encrypted: true
    },
    {
      name: "IncludeEmailsOnActivity",
      value: "IncludeEmailsOnActivity",
      is_encrypted: false
    },
    {
      name: "SetExternalId",
      value: "SetExternalId",
      is_encrypted: true
    },
    {
      name: "StaticList",
      value: "StaticList",
      is_encrypted: true
    }
  ]
  //Netsuite
  var ConnectorsSettings2 = [
    {
      name: "username",
      value: "username",
      is_encrypted: false
    },
    {
      name: "password",
      value: "password",
      is_encrypted: true
    },
    {
      name: "ApplicationId",
      value: "ApplicationId",
      is_encrypted: false
    },
    {
      name: "AccountNumber",
      value: "AccountNumber",
      is_encrypted: true
    },
    {
      name: "ReleasePreview",
      value: "ReleasePreview",
      is_encrypted: true
    },
    {
      name: "IncludeSavedSearches",
      value: "IncludeSavedSearches",
      is_encrypted: false
    },
    {
      name: "Sandbox",
      value: "Sandbox",
      is_encrypted: true
    },
    {
      name: "SetExternalId",
      value: "SetExternalId",
      is_encrypted: true
    }
  ]
  //JIRA
  var ConnectorsSettings3 = [
    {
      name: "username",
      value: "username",
      is_encrypted: false
    },
    {
      name: "password",
      value: "password",
      is_encrypted: true
    },
    {
      name: "Jql",
      value: "Jql",
      is_encrypted: true
    },
    {
      name: "BaseURL",
      value: "BaseURL",
      is_encrypted: true
    },
  ]

  ConnectorsSettingsSchema.validate(ConnectorsSettings1[0]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings1[1]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings1[2]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings1[3]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings1[4]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings2[0]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings2[1]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings2[2]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings2[3]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings2[4]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings2[5]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings2[6]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings2[7]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings3[0]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings3[1]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings3[2]);

  var Netsuite = {
    modified: new Date(),
    created: new Date(),
    name: "Netsuite",
    default_prefix: "NS",
    assembly: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\Flywheel.Connector.Netsuite.dll",
    data_assembly: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\Flywheel.Connector.Netsuite.Data.dll",
    connector_runner_path: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\ConnectorRunner.exe",
    settings: ConnectorsSettings2
  };

  var Marketo = {
    modified: new Date(),
    created: new Date(),
    name: "Marketo",
    default_prefix: "MK",
    assembly: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\Flywheel.Connector.Marketo.dll",
    data_assembly:"C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\Flywheel.Connector.Marketo.Data.dll",
    connector_runner_path: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\ConnectorRunner.exe",
    settings: ConnectorsSettings1
  };

  var Jira = {
    modified: new Date(),
    created: new Date(),
    name: "Jira",
    default_prefix: "JI",
    assembly: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\Flywheel.Connector.Jira.dll",
    data_assembly:"C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\Flywheel.Connector.Jira.Data.dll",
    connector_runner_path: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\ConnectorRunner.exe",
    settings: ConnectorsSettings3
  };
  /*
  var Salesforce = {
    id: 222222,
    modified: new Date(),
    created: new Date(),
    name: "Salesforce",
    default_prefix: "SF",
    assembly: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\Flywheel.Connector.Salesforce.dll",
    data_assembly: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\Flywheel.Connector.Salesforce.Data.dll",
    connector_runner_path: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\ConnectorRunner.exe",
    settings: ConnectorsSettings2
  };

  var Vertify = {
    id: 333333,
    modified: new Date(),
    created: new Date(),
    name: "Vertify",
    default_prefix: "VF",
    assembly: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\Flywheel.Connector.Vertify.dll",
    data_assembly: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\Flywheel.Connector.Vertify.Data.dll",
    connector_runner_path: "C:\\Projects\\vertifyconnectorrunner\\ConnectorRunner\\bin\\Release\\ConnectorRunner.exe",
    settings: ConnectorsSettings1
  };

  */
  Connectors.schema.validate(Netsuite);
  Connectors.schema.validate(Marketo);
  Connectors.schema.validate(Jira);
  //  Connectors.schema.validate(Salesforce);
  //  Connectors.schema.validate(Vertify);

  if(! Connectors.findOne()){
    var connectors = [ Netsuite, Marketo, Jira ];//, Salesforce, Vertify ];
    connectors.forEach(function (connector){
      Connectors.insert(connector);
    })
  }

};

/* TODO: FIX MOCK DATA FOR DEMO PURPOSES */

function initTasks(){

  var authentication = {
    tenant_id: 100000,
    id: 111111,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "authentication",
    status: "success",
    workspace_id: 100000,
    system_id: 100000
  }, discover = {
    tenant_id: 100000,
    id: 222222,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "discover",
    status: "success",
    workspace_id: 100000,
    system_id: 100000
  }, collectschema = {
    tenant_id: 100000,
    id: 333333,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "collectschema",
    status: "success",
    workspace_id: 100000,
    external_object_id: 1
  }, collect = {
    tenant_id: 100000,
    id: 444444,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "collect",
    status: "success",
    workspace_id: 100000,
    external_object_id: 1
  }, matchtest = {
    tenant_id: 100000,
    id: 555555,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "matchtest",
    status: "success",
    workspace_id: 100000,
    vertify_object_id: 100000
  }, match = {
    tenant_id: 100000,
    id: 777777,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "match",
    status: "success",
    workspace_id: 100000,
    vertify_object_id: 100000
  }, aligntest = {
    tenant_id: 100000,
    id: 888888,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "aligntest",
    status: "queued",
    workspace_id: 100000,
    vertify_object_id: 100000
  }, align = {
    tenant_id: 100000,
    id: 999999,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "align",
    status: "queued",
    workspace_id: 100000,
    vertify_object_id: 100000
  }, tasks = [ authentication, discover, collectschema, collect, matchtest, match, aligntest, align];

  tasks.forEach(function (t){
    Tasks.schema.validate(t);
  });

  if(! Tasks.findOne()){
    tasks.forEach(function (t) {
      Tasks.insert(t);
    });
  }
}

function initSystems(){

    var SystemCredentials = [{
          setting: 'username',
          value: 'username'
        },{
          setting: 'password',
          value: 'password'
        },{
          setting: 'api key',
          value: 'api_key'
        },{
          setting: 'token',
          value: 'token'
        }];
    SystemSettingsSchema.validate(SystemCredentials[0]);
    SystemSettingsSchema.validate(SystemCredentials[1]);
    SystemSettingsSchema.validate(SystemCredentials[2]);
    SystemSettingsSchema.validate(SystemCredentials[3]);

    var SystemSettings = [{
          setting: 'setting1',
          value: 'value1'
        },{
          setting: 'setting2',
          value: 'value2',
        }];
    SystemSettingsSchema.validate(SystemSettings[0]);
    SystemSettingsSchema.validate(SystemSettings[1]);

    var SystemExternalObjects = [{
          name: "Netsuite Customer",
          is_dynamic: false
        },{
          name: "Netsuite Object",
          is_dynamic: false
        },{
          name: "Marketo LeadRecord",
          is_dynamic: true
        },{
          name: "Marketo Agent",
          is_dynamic: true
        },{
          name: "Market Object",
          is_dynamic: true
        },{
          name: "Salesforce User",
          is_dynamic: true
        },{
          name: "Salesforce Customer",
          is_dynamic: true
        },{
          name: "Jira Issue",
          is_dynamic: true
        }];
    SystemExternalObjectsSchema.validate(SystemExternalObjects[0]);
    SystemExternalObjectsSchema.validate(SystemExternalObjects[1]);
    SystemExternalObjectsSchema.validate(SystemExternalObjects[2]);
    SystemExternalObjectsSchema.validate(SystemExternalObjects[3]);
    SystemExternalObjectsSchema.validate(SystemExternalObjects[4]);
    SystemExternalObjectsSchema.validate(SystemExternalObjects[5]);
    SystemExternalObjectsSchema.validate(SystemExternalObjects[6]);
    SystemExternalObjectsSchema.validate(SystemExternalObjects[7]);

    // create system objects
    var Netsuite = {
      tenant_id: 100000,
      id: 100000,
      modified: new Date("2015-07-04T20:06:08.310Z"),
      created: new Date("2015-07-04T20:06:08.310Z"),
      is_deleted: false,
      name: 'Netsuite',
      workspace_id: ArtsWs,
      connector_id: 100000,
      max_concurrent_tasks: 9,
      prefix: 'NS',
      agent_id: '',
      authentication: true,
      discover: true,
      credentials: SystemCredentials,
      settings: SystemSettings,
      external_objects: [SystemExternalObjects[0], SystemExternalObjects[1]]
    };

    var Marketo = {
      tenant_id: 100000,
      id: 111111,
      modified: new Date("2015-07-04T20:06:08.310Z"),
      created: new Date("2015-07-04T20:06:08.310Z"),
      is_deleted: false,
      workspace_id: ArtsWs,
      name: 'Marketo',
      connector_id: 111111,
      max_concurrent_tasks: 8,
      prefix: 'MK',
      agent_id: '',
      authentication: true,
      discover: true,
      credentials: SystemCredentials,
      settings: SystemSettings,
      external_objects: [SystemExternalObjects[2],SystemExternalObjects[3],SystemExternalObjects[4]]
    };

    var Jira = {
      tenant_id: 100000,
      id: 444444,
      modified: new Date(),
      created: new Date(),
      is_deleted: false,
      workspace_id: ArtsWs,
      name: 'Jira',
      connector_id: 444444,
      max_concurrent_tasks: 2,
      prefix: 'JI',
      agent_id: '',
      authentication: true,
      discover: true,
      credentials: SystemCredentials,
      settings: SystemSettings,
      external_objects: [SystemExternalObjects[7]]
    };

    /*
    var Salesforce = {
      tenant_id: 100000,
      id: 222222,
      modified: new Date("2015-07-04T20:06:08.310Z"),
      created: new Date("2015-07-04T20:06:08.310Z"),
      is_deleted: false,
      workspace_id: 222222,
      name: 'Salesforce',
      connector_id: 222222,
      max_concurrent_tasks: 7,
      prefix: 'SF',
      agent_id: '',
      authentication: true,
      discover: false,
      credentials: SystemCredentials,
      settings: SystemSettings,
      external_objects: [SystemExternalObjects[5],SystemExternalObjects[6]]
    };

    var Vertify = {
      tenant_id: 100000,
      id: 333333,
      modified: new Date("2015-07-04T20:06:08.310Z"),
      created: new Date("2015-07-04T20:06:08.310Z"),
      is_deleted: false,
      workspace_id: 111111,
      name: 'Vertify',
      connector_id: 333333,
      max_concurrent_tasks: 7,
      prefix: 'VF',
      agent_id: '',
      authentication: false,
      discover: false,
      credentials: SystemCredentials,
      settings: SystemSettings,
      external_objects: []
    };
  */
    Systems.schema.validate(Netsuite);
    Systems.schema.validate(Marketo);
    Systems.schema.validate(Jira);
    //  Systems.schema.validate(Salesforce);
  //  Systems.schema.validate(Vertify);

    if (! Systems.findOne()){
      var systems = [ Netsuite, Marketo, Jira];//, Salesforce, Vertify ];
      systems.forEach(function (system) {
        Systems.insert(system);
      })
    }
};

function initExternalObjects() {

  var ExternalObjectProperties1 = [{
      name: "internalId",
      is_custom: false,
      is_array: false,
      type: "integer",
      is_key: true
    },
    {
      name: "firstName",
      is_custom: false,
      is_array: false,
      type: "string",
      is_key: false
    },
    {
      name: "company",
      is_custom: false,
      is_array: false,
      type: "string",
      is_key: false
    }]

    var ExternalObjectProperties2 = [{
      name: "Id",
      is_custom: false,
      is_array: false,
      external_type: "System.Int32",
      type: "integer",
      is_key: true
    },
    {
      name: "Email",
      is_custom: false,
      is_array: false,
      external_type: "System.String",
      type: "string",
      is_key: false
    },{
      name: "CompanyId",
      is_custom: false,
      is_array: false,
      external_type: "System.Int32",
      type: "integer",
      is_key: true
    },
    {
      name: "leadAttributeList",
      is_custom: false,
      is_array: false,
      external_type: "System.String",
      type: "string",
      is_key: false
    },
    {
      name: "leadAttributeList.FirstName",
      is_custom: false,
      is_array: false,
      external_type: "System.String",
      type: "string",
      is_key: false
    },{
      name: "leadAttributeList.LastName",
      is_custom: false,
      is_array: false,
      external_type: "System.String",
      type: "string",
      is_key: true
    },{
      name: "leadAttributeList.Email",
      is_custom: false,
      is_array: false,
      external_type: "System.String",
      type: "string",
      is_key: true
    },
    {
      name: "leadAttributeList.Company",
      is_custom: false,
      is_array: false,
      external_type: "System.Int32",
      type: "string",
      is_key: false
    }
  ]

  ExternalObjectProperties1.forEach(function(eop1){
    ExternalObjectProperties.schema.validate(eop1);
  });

  ExternalObjectProperties2.forEach(function(eop2){
    ExternalObjectProperties.schema.validate(eop2);
  });

  var netsuiteobj = {
    tenant_id: 100000,
    id:  1,
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Netsuite Customer",
    system_id: 100000,
    workspace_id: 100000,
    collectschema: true,
    collect: true,
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 20000,
    percentage: 100,
    type: "",
    properties: ExternalObjectProperties1,
    generic_integer_1: 1,
    generic_integer_2: null,
    generic_integer_3: null,
    generic_string_1: "string",
    generic_string_2: null,
    generic_string_3: null,
    is_custom: false,
    level: "",
    is_hidden: false,
    last_modified_property_name: "",
    supports_add: true,
    supports_update: true,
    supports_delete: true,
    supports_query: true,
    supports_pagination: true,
    supports_last_modified_query: true,
    collect_filters: "string"
  };

  var marketoobj = {
    tenant_id: 100000,
    id:  2,
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Marketo Object",
    system_id: 111111,
    workspace_id: 100000,
    collectschema: true,
    collect: true,
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 15000,
    percentage: 100,
    type: "",
    properties: ExternalObjectProperties2,
    generic_integer_1: 1,
    generic_integer_2: null,
    generic_integer_3: null,
    generic_string_1: "string",
    generic_string_2: null,
    generic_string_3: null,
    is_custom: false,
    level: "",
    is_hidden: false,
    last_modified_property_name: "",
    supports_add: true,
    supports_update: true,
    supports_delete: true,
    supports_query: true,
    supports_pagination: true,
    supports_last_modified_query: true,
    collect_filters: "string"
  };

  var marketolead = {
    tenant_id: 100000,
    id:  3,
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Marketo LeadRecord",
    system_id: 111111,
    workspace_id: 100000,
    collectschema: true,
    collect: true,
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 10000,
    percentage: 100,
    type: "",
    properties: ExternalObjectProperties2,
    generic_integer_1: 1,
    generic_integer_2: null,
    generic_integer_3: null,
    generic_string_1: "string",
    generic_string_2: null,
    generic_string_3: null,
    is_custom: false,
    level: "",
    is_hidden: false,
    last_modified_property_name: "",
    supports_add: true,
    supports_update: true,
    supports_delete: true,
    supports_query: true,
    supports_pagination: true,
    supports_last_modified_query: true,
    collect_filters: "string"
  };

  var jiraissue = {
    tenant_id: 100000,
    id:  4,
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Jira Issue",
    system_id: 444444,
    workspace_id: 100000,
    collectschema: true,
    collect: true,
    last_query: new Date(),
    page_size: 10,
    request_size: 5,
    record_count: 6600,
    percentage: 100,
    type: "",
    properties: ExternalObjectProperties1,
    generic_integer_1: 1,
    generic_integer_2: null,
    generic_integer_3: null,
    generic_string_1: "string",
    generic_string_2: null,
    generic_string_3: null,
    is_custom: false,
    level: "",
    is_hidden: false,
    last_modified_property_name: "",
    supports_add: true,
    supports_update: true,
    supports_delete: true,
    supports_query: true,
    supports_pagination: true,
    supports_last_modified_query: true,
    collect_filters: "string"
  };

    /*
    var salesforceuser = {
      tenant_id: 100000,
      id:  4,
      modified:  new Date(),
      created:   new Date(),
      is_deleted: false,
      name: "Salesforce User",
      system_id: 222222,
      workspace_id: 222222,
      collectschema: false,
      collect: false,
      last_query: new Date(),
      page_size: 25,
      request_size: 5,
      record_count: 18000,
      percentage: 0,
      type: "",
      properties: ExternalObjectProperties1,
      generic_integer_1: 1,
      generic_integer_2: null,
      generic_integer_3: null,
      generic_string_1: "string",
      generic_string_2: null,
      generic_string_3: null,
      is_custom: false,
      level: "",
      is_hidden: false,
      last_modified_property_name: "",
      supports_add: true,
      supports_update: true,
      supports_delete: true,
      supports_query: true,
      supports_pagination: true,
      supports_last_modified_query: true,
      collect_filters: "string"
    };

    var salesforcecustomer = {
      tenant_id: 100000,
      id:  5,
      modified:  new Date(),
      created:   new Date(),
      is_deleted: false,
      name: "Salesforce Customer",
      system_id: 222222,
      workspace_id: 222222,
      collectschema: false,
      collect: false,
      last_query: new Date(),
      page_size: 25,
      request_size: 5,
      record_count: 12000,
      percentage: 0,
      type: "",
      properties: ExternalObjectProperties2,
      generic_integer_1: 1,
      generic_integer_2: null,
      generic_integer_3: null,
      generic_string_1: "string",
      generic_string_2: null,
      generic_string_3: null,
      is_custom: false,
      level: "",
      is_hidden: false,
      last_modified_property_name: "",
      supports_add: true,
      supports_update: true,
      supports_delete: true,
      supports_query: true,
      supports_pagination: true,
      supports_last_modified_query: true,
      collect_filters: "string"
    };
    */

    ExternalObjects.schema.validate(netsuiteobj);
    ExternalObjects.schema.validate(marketoobj);
    ExternalObjects.schema.validate(marketolead);
    ExternalObjects.schema.validate(jiraissue);
    //  ExternalObjects.schema.validate(salesforceuser);
    //  ExternalObjects.schema.validate(salesforcecustomer);
    if(! ExternalObjects.findOne()){
      var external_objects = [
        netsuiteobj,
        marketoobj,
        marketolead,
        jiraissue
      //salesforceuser,
      //salesforcecustomer
      ];
      external_objects.forEach(function (obj){
        ExternalObjects.insert(obj);
      })
    }

}

function initVertifyObjects() {

  var VertifyObjectExternalObjectInbound1 = {
    sync_action: ["add","update","delete"],
    filter: {
      operator: "and",
      value: [{
        external_property:"city",
        operator: "eq",
        value: [{ value: "Austin"}]
      },
      {
        external_property:"state",
        operator: "in",
        value: [{ value: [ "TX", "CA"]}]
      }]
    },
  }
  var VertifyObjectExternalObjectOutbound1 = {
    sync_action: ["add","update","delete"],
    filter: null
  }
  VertifyObjectExternalObjectInboundSchema.validate(VertifyObjectExternalObjectInbound1);
  VertifyObjectExternalObjectOutboundSchema.validate(VertifyObjectExternalObjectOutbound1);

  var VertifyObjectMatchGroup1 = {
    external_property: "email",
    operator: "eq",
    vertify_property: "Email"
  }
  VertifyObjectMatchGroupSchema.validate(VertifyObjectMatchGroup1);

  var VertifyObjectMatch1 = {
    operator: "and",
    group: [VertifyObjectMatchGroup1],
    confidence: 100
  }
  VertifyObjectMatchSchema.validate(VertifyObjectMatch1);
  //NS Customer
  var VertifyObjectExternalObject1 = {
    external_object_id: 1,
    system_id: 100000,
    inbound: VertifyObjectExternalObjectInbound1,
    outbound: VertifyObjectExternalObjectOutbound1,
    match: VertifyObjectMatch1,
    approved: true,
    is_truth: true
  }
  VertifyObjectExternalObjectsSchema.validate(VertifyObjectExternalObject1);

  VertifyObjectExternalObjectInbound2 = {
    sync_action: ["add","update","delete"],
    filter: {
      operator: "and",
      value: [{
        external_property:"leadAttributeList.City",
        operator: "eq",
        value: [ { value: "Austin" }]
      },
      {
        external_property:"leadAttibuteList.State",
        operator: "in",
        value: [ { value: ["TX", "CA"] }]
      },
      {
        operator: "or",
        value: [
          {
            external_property:"leadAttributeList.Zip",
            operator: "eq",
            value: [ { value: "19006" } ]
          },
          {
            external_property:"leadAttibuteList.State",
            operator: "eq",
            value: [{ value: "PA" }]
          }]
      }]
    },
  }
  VertifyObjectExternalObjectOutbound2 = {
    sync_action: ["add","update","delete"],
    filter: null
  }
  VertifyObjectExternalObjectInboundSchema.validate(VertifyObjectExternalObjectInbound2);
  VertifyObjectExternalObjectOutboundSchema.validate(VertifyObjectExternalObjectOutbound2);

  var VertifyObjectMatchGroup21 =
    { external_property: "leadAttributeList.City"
    , operator: "eq"
    , vertify_property: "City" }

  var VertifyObjectMatchGroup22 =
    { external_property: "leadAttributeList.FirstName"
    , operator: "fuzzy"
    , vertify_property: "FirstName"
    , confidence: 99 }

  var VertifyObjectMatchGroup23 =
    { external_property: "leadAttributeList.LastName"
    , operator: "fuzzy"
    , confidence: 99
    , vertify_property: "LastName" }

  VertifyObjectMatchGroupSchema.validate(VertifyObjectMatchGroup21);
  VertifyObjectMatchGroupSchema.validate(VertifyObjectMatchGroup22);
  VertifyObjectMatchGroupSchema.validate(VertifyObjectMatchGroup23);


  var VertifyObjectMatchGroup11 =
    { operator: "and"
    , group: [VertifyObjectMatchGroup21] }
  var VertifyObjectMatchGroup12 =
    { operator: "and"
    , group: [VertifyObjectMatchGroup22] }
  VertifyObjectMatchSchema.validate(VertifyObjectMatchGroup11);
  VertifyObjectMatchSchema.validate(VertifyObjectMatchGroup12);

  var VertifyObjectMatch2 =
    { operator: "and"
    ,  group: [ VertifyObjectMatchGroup11, VertifyObjectMatchGroup12 ]
    ,  confidence: 100 }
  VertifyObjectMatchSchema.validate(VertifyObjectMatch2);

  //MK Lead
  var VertifyObjectExternalObject2 = {
    external_object_id: 3,
    system_id: 111111,
    inbound: VertifyObjectExternalObjectInbound2,
    outbound: VertifyObjectExternalObjectOutbound2,
    match: VertifyObjectMatch2,
    approved: true,
    is_truth: false
  }
  VertifyObjectExternalObjectsSchema.validate(VertifyObjectExternalObject2);

  var VertifyObject = {
    tenant_id: 100000,
    id: 100000,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    name: "Vertify Lead",
    workspace_id: 100000,
    match: true,
    aligntest: false,
    align: false,
    analyze_status: "disabled",
    external_objects: [ VertifyObjectExternalObject1, VertifyObjectExternalObject2 ]
  }

  //Add to Mongo DB
  VertifyObjects.schema.validate(VertifyObject);
  if(! VertifyObjects.findOne()){
    VertifyObjects.insert(VertifyObject);
  }
}

function initVertifyProperties() {

  var VertifyPropertyRulesRule1 = {
    rule: "set",
    external_property: "firstname"
  };
  var VertifyPropertyRulesRule2 = {
    rule: "set",
    external_property: "leadAttributeList.FirstName"
  };
  VertifyPropertyRulesRuleSchema.validate(VertifyPropertyRulesRule1);
  VertifyPropertyRulesRuleSchema.validate(VertifyPropertyRulesRule2);

  var VertifyPropertyRules1 = {
        external_object_id: 1,
        direction: "bidirectional",
        sync_action: "add_update",
        rule: VertifyPropertyRulesRule1,
        is_truth: true
      };
  var VertifyPropertyRules2 = {
        external_object_id: 3,
        direction: "bidirectional",
        sync_action: "add_update",
        rule: VertifyPropertyRulesRule2,
        is_truth: false
      };
  VertifyPropertyRulesSchema.validate(VertifyPropertyRules1);
  VertifyPropertyRulesSchema.validate(VertifyPropertyRules2);

  var VertifyPropertyFields1 = {
	        external_object_id: 1,
	        external_property_path: "$.properties[?(@.name=='firstName')]",
          name: "FirstName",
          inbound: {
	            filter: null,
    	        sync_action: ["add","update"]
	        },
	        outbound: {
	            filter: null,
    	        sync_action: ["add","update"]
	        },
	        match: null,
	        is_truth: true,
          approved: true
	    }
    var VertifyPropertyFields2 = {
  	        external_object_id: 1,
  	        external_property_path: "$.properties[?(@.name=='leadAttributeList.FirstName')]",
            name: "FirstName",
            inbound: {
  	            filter: null,
      	        sync_action: ["add","update"]
  	        },
  	        outbound: {
  	            filter: null,
      	        sync_action: ["add","update"]
  	        },
  	        match: null,
  	        is_truth: true,
            approved: true
  	    }

  var VertifyPropertyFields3 = {
	        external_object_id: 3,
          external_property_path: "$.billingaddress",
	        name: "Billing Address",
	        inbound: {
    	        sync_action: ["add","update"],
	            filter: {
    	            operator: "and", value: [
    	                { external_property: "BillingCity", operator: "isnotnull" },
    	                { external_property: "BillingState", operator: "isnotnull" },
    	                { external_property: "BillingStreet", operator: "isnotnull" },
    	                { external_property: "BillingPostalCode", operator: "isnotnull" }
                    ]
    	        }
	        },
	        outbound: {
    	        sync_action: ["add","update"],
    	        filter: {
    	            operator: "and", value: [
    	                { external_property: "IsBilling", operator: "eq", value: true }
                    ]
    	        }
	        },
	        match: {
	            operator: "and",
              value: [
	                { external_property: "defaultBilling", operator: "eq", vertify_property: "DefaultBilling" }
                ]
	        },
	        is_truth: false,
          approved: false
	    }
  var VertifyPropertyFields4 = {
	        external_object_id: 3,
          external_property_path: "lev1.lev2.$.shippingaddress",
	        name: "Shipping Address",
	        inbound: {
    	        sync_action: ["add","update"],
    	        filter: {
    	            operator: "and", value: [
    	                { external_property: "ShippingCity", operator: "isnotnull" },
    	                { external_property: "ShippingState", operator: "isnotnull" },
    	                { external_property: "ShippingStreet", operator: "isnotnull" },
    	                { external_property: "ShippingPostalCode", operator: "isnotnull" }
                    ]
    	        }
	        },
	        outbound: {
    	        sync_action: ["add","update"],
    	        filter: {
    	            operator: "and", value: [
    	                { external_property: "IsShipping", operator: "eq", value: true }
                    ]
    	        }
	        },
	        match: {
	            operator: "and", value: [
	                { external_property: "defaultShipping", operator: "eq", vertify_property: "IsShipping" }
                ]
	        },
	        is_truth: false,
          approved: false
	    }

  VertifyPropertyFieldsSchema.validate(VertifyPropertyFields1);
  VertifyPropertyFieldsSchema.validate(VertifyPropertyFields2);
  VertifyPropertyFieldsSchema.validate(VertifyPropertyFields3);

  var VertifyProperties1 = {
    tenant_id: 100000,
    id: 100000,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    workspace_id: 100000,
    vertify_object_id: 100000,
    parent_property_id: 100000,
    align_method: "exact",
    name: "FirstName",
    friendly_name: "First Name" ,
    level: 0,
    rules: [VertifyPropertyRules1, VertifyPropertyRules2],
    fields: [VertifyPropertyFields1, VertifyPropertyFields2 ]
  };

  var VertifyProperties2 = {
    tenant_id: 100000,
    id: 111111,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    workspace_id: 100000,
    vertify_object_id: 100000,
    parent_property_id: 100000,
    align_method: "exact",
    name: "PricingMatrix",
    friendly_name: "Pricing Matrix" ,
    level: 0
  };

  VertifyProperties.schema.validate(VertifyProperties1);
  VertifyProperties.schema.validate(VertifyProperties2);


  if(! VertifyProperties.findOne()){
    VertifyProperties.insert(VertifyProperties1);
    VertifyProperties.insert(VertifyProperties2);
  };

}

function initMatchResults() {
  var matchResultsExternalObjects = [{
    external_object_id: 1,
    is_truth: true,
    total: 125000,
    matched: 100,
    duplicates: 2,
    not_matched: 0,
  },
  {
    external_object_id: 3,
    is_truth: false,
    total: 30000,
    matched: 25,
    duplicates: 3,
    not_matched: 5000
  }]

  matchResultsExternalObjects.forEach(function (eo){
    MatchResultsExternalObjectsSchema.validate(eo);
  });

  var matchResults = {
    tenant_id: 100000,
    id: 100000,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    workspace_id: 100000,
    vertify_object_id: 100000,
    total: 100,
    matched: 100,
    duplicates: 5,
    not_matched: 5000,
    external_objects: matchResultsExternalObjects
  }

  //Add to DB
  MatchResults.schema.validate(matchResults);
  if(! MatchResults.findOne()){
    MatchResults.insert(matchResults);
  }

}

function initAlignResults(){

  var alignmentObjectFieldMK = [{
      external_object_id: 3,
      external_property_path: "FirstName",
      is_truth: true
    },
      { external_object_id: 3,
      external_property_path: "Lastname",
      is_truth: true
    },
      {external_object_id: 3,
      external_property_path: "Status",
      is_truth: true
    },
      {external_object_id: 3,
      external_property_path: "Company",
      is_truth: true
    }]
  , alignmentObjectFieldNS = [{
    external_object_id: 1,
    external_property_path: "firstname",
    is_truth: false
  },
    { external_object_id: 1,
    external_property_path: "lastname",
    is_truth: false
  },
    {external_object_id: 1,
    external_property_path: "entityStatus",
    is_truth: false
  },
    {external_object_id: 1,
    external_property_path: "organization",
    is_truth: false
  }];

  alignmentObjectFieldMK.forEach(function(fieldmk){
    AlignmentObjectField.validate(fieldmk);
  });
  alignmentObjectFieldNS.forEach(function(fieldns){
    AlignmentObjectField.validate(fieldns);
  });

  var alignmentVertifyField = [{
    name: "FirstName",
    align_method: "exact",
    align_percent: 100,
    approved: true,
    fields: [alignmentObjectFieldMK[0], alignmentObjectFieldNS[0]]
  },{
    name: "LastName",
    friendly_name: "",
    align_method: "exact",
    align_percent: 100,
    approved: true,
    fields: [alignmentObjectFieldMK[1], alignmentObjectFieldNS[1]]
  },{
    name: "Lead Status",
    friendly_name: "",
    align_method: "exact",
    align_percent: 100,
    approved: true,
    fields: [alignmentObjectFieldMK[2], alignmentObjectFieldNS[2]]
  },{
    name: "Company Name",
    friendly_name: "",
    align_method: "exact",
    align_percent: 100,
    approved: true,
    fields: [alignmentObjectFieldMK[3], alignmentObjectFieldNS[3]]
  }];

  alignmentVertifyField.forEach(function(field){
    AlignmentVertifyField.validate(field);
  });

  var alignResults = {
    id: 1,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    workspace_id: 100000,
    vertify_object_id: 100000,
    total: 4,
    aligned: 4,
    approved: false,
    alignment_properties: [alignmentVertifyField[0],alignmentVertifyField[1],alignmentVertifyField[2],alignmentVertifyField[3]]
  };

  //Add to DB
  AlignResults.schema.validate(alignResults);
  if(! AlignResults.findOne()){
    AlignResults.insert(alignResults);
  }
}
