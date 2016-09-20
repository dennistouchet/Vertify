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
import { Tasks } from '../imports/collections/global/task.js';
import { Connectors, ConnectorsSettingsSchema } from '../imports/collections/global/connectors.js';
import { ObjectsList } from '../imports/collections/global/object_list.js';
// Workspace Collection Imports
import { MarketoLeadRecord } from '../imports/collections/workspace/marketo_lead_record.js';

Meteor.startup(function(){

// Remove all collections in development environment when set to true
var clearCollections = false;
if( Meteor.isDevelopment && clearCollections) {
  deleteAllCollections();
}

//MatchSetup.remove({});
//console.log("temp MatchSetup collection deleted");

initTasks();

initWorkspaces();

initConnectors();

initSystems();

initExternalObjects();

initVertifyObjects();

initVertifyProperties();

initDatas();

initNavitems();

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

  beforeCount = MarketoLeadRecord.find().count();
  MarketoLeadRecord.remove({});
  afterCount = MarketoLeadRecord.find().count();
  console.log("MarketoLeadRecord collection deleted (" + (beforeCount - afterCount) + " rows)");
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
    description: 'This is the dashboard description',
    order: 1,
    route: '/',
    icon: 'glyphicon-dashboard',
    subnavs: []
  }

  var Setup = {
    name: 'Setup',
    shortdesc: '',
    description: 'This is the Setup description',
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
    description: 'This is the Data description',
    order: 3,
    route: '/data',
    icon: 'glyphicon-cloud',
    subnavs: [{
          name: 'Diagnose',
          shortdesc: '',
          subnavs: [],
          description: 'This is the Diagnose description',
          order: 1,
          route: '/data/diagnose',
          icon: 'glyphicon-warning-sign'
        },
        {
          name: 'Fix',
          shortdesc: '',
          subnavs: [],
          description: 'This is the Fix description',
          order: 2,
          route: '/data/fix',
          icon: 'glyphicon-stats'
        },
        {
          name: 'Sync',
          shortdesc: '',
          subnavs: [],
          description: 'This is the Sync description',
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
    description: 'This is the Admin description',
    order: 4,
    route: '/admin',
    icon: 'glyphicon-cog',
    subnavs: [{
          name: 'Workspaces',
          shortdesc: '',
          subnavs: [],
          description: 'This is the Collect description',
          order: 1,
          route: '/admin/workspaces',
          icon: 'glyphicon-tasks'
        },
        {
          name: 'Users',
          shortdesc: '',
          subnavs: [],
          description: 'This is the Connect description',
          order: 2,
          route: '/admin/users',
          icon: 'glyphicon-user'
        },
        {
          name: 'Groups',
          shortdesc: '',
          subnavs: [],
          description: 'This is the Match description',
          order: 3,
          route: '/admin/groups',
          icon: 'glyphicon-align-center'
        },
        {
          name: 'Agents',
          shortdesc: '',
          subnavs: [],
          description: 'This is the Align description',
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

function initTasks(){

  var authentication = {
    id: 111111,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "authentication",
    status: "success",
    workspace_id: 100000,
    system_id: 100000
  }, discover = {
    id: 222222,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "discover",
    status: "success",
    workspace_id: 100000,
    system_id: 100000
  }, collectschema = {
    id: 333333,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "collectschema",
    status: "success",
    workspace_id: 100000,
    external_object_id: 1
  }, collect = {
    id: 444444,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "collect",
    status: "success",
    workspace_id: 100000,
    external_object_id: 1
  }, matchtest = {
    id: 555555,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "matchtest",
    status: "success",
    workspace_id: 100000,
    vertify_object_id: 100000
  }, match = {
    id: 777777,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "match",
    status: "success",
    workspace_id: 100000,
    vertify_object_id: 100000
  }, aligntest = {
    id: 888888,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    task: "aligntest",
    status: "queued",
    workspace_id: 100000,
    vertify_object_id: 100000
  }, align = {
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

function initWorkspaces(){
  var ArtsWorkspace = {
    tenant_id: 100000,
    id: 100000,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    is_archived: false,
    name: "Art's Workspace",
    group_id: 100000
  };

  var JimsWorkspace = {
    tenant_id: 111111,
    id: 111111,
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    is_archived: false,
    name: "Jim's Workspace",
    group_id: 111111
  };

  var ShaunsWorkspace = {
    tenant_id: 222222,
    id: 222222,
    modified: new Date("2015-07-04T20:06:08.310Z"),
    created: new Date("2015-07-04T20:06:08.310Z"),
    is_deleted: true,
    is_archived: true,
    name: "Shaun's Workspace",
    group_id: 222222
  };

  Workspaces.schema.validate(ArtsWorkspace);
  Workspaces.schema.validate(JimsWorkspace);
  Workspaces.schema.validate(ShaunsWorkspace);
  if(! Workspaces.findOne()){
    var workspaces = [ ArtsWorkspace, JimsWorkspace, ShaunsWorkspace ];
    workspaces.forEach(function (workspace) {
      Workspaces.insert(workspace);
    })
  }
};

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
      }];
  SystemExternalObjectsSchema.validate(SystemExternalObjects[0]);
  SystemExternalObjectsSchema.validate(SystemExternalObjects[1]);
  SystemExternalObjectsSchema.validate(SystemExternalObjects[2]);
  SystemExternalObjectsSchema.validate(SystemExternalObjects[3]);
  SystemExternalObjectsSchema.validate(SystemExternalObjects[4]);
  SystemExternalObjectsSchema.validate(SystemExternalObjects[5]);
  SystemExternalObjectsSchema.validate(SystemExternalObjects[6]);

  // create system objects
  var Netsuite = {
    tenant_id: 100000,
    id: 100000,
    modified: new Date("2015-07-04T20:06:08.310Z"),
    created: new Date("2015-07-04T20:06:08.310Z"),
    is_deleted: false,
    name: 'Netsuite',
    workspace_id: 100000,
    connector_id: 100000,
    max_concurrent_tasks: 9,
    prefix: 'NS',
    agent_id: '',
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
    workspace_id: 100000,
    name: 'Marketo',
    connector_id: 111111,
    max_concurrent_tasks: 8,
    prefix: 'MK',
    agent_id: '',
    credentials: SystemCredentials,
    settings: SystemSettings,
    external_objects: [SystemExternalObjects[2],SystemExternalObjects[3],SystemExternalObjects[4]]
  };

  var Salesforce = {
    tenant_id: 222222,
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
    credentials: SystemCredentials,
    settings: SystemSettings,
    external_objects: [SystemExternalObjects[5],SystemExternalObjects[6]]
  };

  var Vertify = {
    tenant_id: 111111,
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
    credentials: SystemCredentials,
    settings: SystemSettings,
    external_objects: []
  };

  Systems.schema.validate(Netsuite);
  Systems.schema.validate(Marketo);
  Systems.schema.validate(Salesforce);
  Systems.schema.validate(Vertify);

  if (! Systems.findOne()){
    var systems = [ Netsuite, Marketo, Salesforce, Vertify ];
    systems.forEach(function (system) {
      Systems.insert(system);
    })
  }
};

function initConnectors() {

  var ConnectorsSettings1 = [
    {
      name: "username",
      value: "username",
      is_encrypted: false
    },
    {
      name: "password",
      value: "password",
      is_encrypted: true
    }
  ]
  var ConnectorsSettings2 = [
    {
      name: "login",
      value: "login",
      is_encrypted: false
    },
    {
      name: "password",
      value: "password",
      is_encrypted: true
    },
    {
      name: "api key",
      value: "api key",
      is_encrypted: true
    }
  ]
  ConnectorsSettingsSchema.validate(ConnectorsSettings1[0]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings1[1]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings2[0]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings2[1]);
  ConnectorsSettingsSchema.validate(ConnectorsSettings2[2]);

  var Netsuite = {
    id: 100000,
    modified: new Date(),
    created: new Date(),
    name: "Netsuite",
    namespace: "Elixir.Connector.Netsuite",
    default_prefix: "NS",
    requires_agent: false,
    settings: ConnectorsSettings2
  };

  var Marketo = {
    id: 111111,
    modified: new Date(),
    created: new Date(),
    name: "Marketo",
    namespace: "Elixir.Connector.Marketo",
    default_prefix: "MK",
    requires_agent: false,
    settings: ConnectorsSettings1
  };

  var Salesforce = {
    id: 222222,
    modified: new Date(),
    created: new Date(),
    name: "Salesforce",
    namespace: "Elixir.Connector.Salesforce",
    default_prefix: "SF",
    requires_agent: false,
    settings: ConnectorsSettings2
  };

  var Vertify = {
    id: 333333,
    modified: new Date(),
    created: new Date(),
    name: "Vertify",
    namespace: "Elixir.Connector.Vertify",
    default_prefix: "VF",
    requires_agent: false,
    settings: ConnectorsSettings1
  };

  Connectors.schema.validate(Netsuite);
  Connectors.schema.validate(Marketo);
  Connectors.schema.validate(Salesforce);
  Connectors.schema.validate(Vertify);

  if(! Connectors.findOne()){
    var connectors = [ Netsuite, Marketo, Salesforce, Vertify ];
    connectors.forEach(function (connector){
      Connectors.insert(connector);
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
  },{
    name: "leadAttributeList.Name",
    is_custom: false,
    is_array: false,
    external_type: "System.String",
    type: "string",
    is_key: true
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
  },
  {
    name: "leadAttributeList.Company",
    is_custom: false,
    is_array: false,
    external_type: "System.Int32",
    type: "string",
    is_key: false
  }]

  ExternalObjectProperties.schema.validate(ExternalObjectProperties1[0]);
  ExternalObjectProperties.schema.validate(ExternalObjectProperties1[1]);
  ExternalObjectProperties.schema.validate(ExternalObjectProperties2[0]);
  ExternalObjectProperties.schema.validate(ExternalObjectProperties2[1]);
  ExternalObjectProperties.schema.validate(ExternalObjectProperties2[2]);
  ExternalObjectProperties.schema.validate(ExternalObjectProperties2[3]);
  ExternalObjectProperties.schema.validate(ExternalObjectProperties2[4]);
  ExternalObjectProperties.schema.validate(ExternalObjectProperties2[5]);
  ExternalObjectProperties.schema.validate(ExternalObjectProperties2[6]);
  ExternalObjectProperties.schema.validate(ExternalObjectProperties2[7]);

  var netsuiteobj = {
    tenant_id: 100000,
    id:  1,
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Netsuite Customer",
    system_id: 100000,
    workspace_id: 100000,
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 20000,
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
    supports_collect_filters: true,
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
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 10000,
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
    supports_collect_filters: true,
    collect_filters: "string"
  };

  var marketolead = {
    tenant_id: 111111,
    id:  3,
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Marketo LeadRecord",
    system_id: 111111,
    workspace_id: 100000,
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 10000,
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
    supports_collect_filters: true,
    collect_filters: "string"
  };

  var salesforceuser = {
    tenant_id: 222222,
    id:  4,
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Salesforce User",
    system_id: 222222,
    workspace_id: 222222,
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 10000,
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
    supports_collect_filters: true,
    collect_filters: "string"
  };

  var salesforcecustomer = {
    tenant_id: 222222,
    id:  5,
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Salesforce Customer",
    system_id: 222222,
    workspace_id: 222222,
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 10000,
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
    supports_collect_filters: true,
    collect_filters: "string"
  };

  ExternalObjects.schema.validate(netsuiteobj);
  ExternalObjects.schema.validate(marketoobj);
  ExternalObjects.schema.validate(marketolead);
  ExternalObjects.schema.validate(salesforceuser);
  ExternalObjects.schema.validate(salesforcecustomer);
  if(! ExternalObjects.findOne()){
    var external_objects = [
      netsuiteobj,
      marketoobj,
      marketolead,
      salesforceuser,
      salesforcecustomer
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
    inbound: VertifyObjectExternalObjectInbound1,
    outbound: VertifyObjectExternalObjectOutbound1,
    match: VertifyObjectMatch1,
    approved: false,
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
    inbound: VertifyObjectExternalObjectInbound2,
    outbound: VertifyObjectExternalObjectOutbound2,
    match: VertifyObjectMatch2,
    approved: false,
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
    set: { external_property: "firstname"}
  };
  var VertifyPropertyRulesRule2 = {
    set: { external_property: "leadAttributeList.FirstName"}
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

  var VertifyPropertyExternalObjects1 = {
	        external_object_id: 1,
	        external_property_path: "$.properties[?(@.name=='addressbookList.addressbook')]",
	        property_group: 3,
	        inbound: {
	            filter: null,
    	        sync_action: "add_update"
	        },
	        outbound: {
	            filter: null,
    	        sync_action: "add_update"
	        },
	        match: null,
	        is_truth: true
	    }
  var VertifyPropertyExternalObjects2 = {
	        external_object_id: 3,
	        name: "Billing Address",
	        property_group: 1,
	        inbound: {
    	        sync_action: "add_update",
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
    	        sync_action: "add_update",
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
	        is_truth: false
	    }
  var VertifyPropertyExternalObjects3 = {
	        external_object_id: 3,
	        name: "Shipping Address",
	        property_group: 2,
	        inbound: {
    	        sync_action: "add_update",
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
    	        sync_action: "add_update",
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
	        is_truth: false
	    }
  VertifyPropertyExternalObjectsSchema.validate(VertifyPropertyExternalObjects1);
  VertifyPropertyExternalObjectsSchema.validate(VertifyPropertyExternalObjects2);
  VertifyPropertyExternalObjectsSchema.validate(VertifyPropertyExternalObjects3);

  var VertifyProperties1 = {
  tenant_id: 1,
  id: 100000,
  modified: new Date(),
  created: new Date(),
  is_deleted: false,
  workspace_id: 100000,
  vertify_object_id: 100000,
  parent_property_id: 100000,
  name: "FirstName",
  friendly_name: "First Name" ,
  type: "string",  //rules object for string //external_objects for array
  level: 0
  }

  var VertifyProperties2 = {
  tenant_id: 1,
  id: 111111,
  modified: new Date(),
  created: new Date(),
  is_deleted: false,
  workspace_id: 100000,
  vertify_object_id: 100000,
  parent_property_id: 100000,
  name: "PricingMatrix",
  friendly_name: "Pricing Matrix" ,
  type: "array",  //rules object for string //external_objects for array
  level: 0
  }

  VertifyProperties.schema.validate(VertifyProperties1);
  VertifyProperties.schema.validate(VertifyProperties2);


  if(! VertifyProperties.findOne()){
    VertifyProperties.insert(VertifyProperties1);
    VertifyProperties.insert(VertifyProperties2);
  }

}
