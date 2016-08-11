//Meteor Imports
import { Meteor } from 'meteor/meteor';
//General Collection Imports
import { Navitems } from '../imports/collections/navitems.js';
import { Datas } from '../imports/collections/datas';
// Tenant Collection Imports
import { Workspaces } from '../imports/collections/tenant/workspace.js';
import { Systems } from '../imports/collections/tenant/system.js';
import { Objects } from '../imports/collections/tenant/object.js';
import { SystemObjects } from '../imports/collections/tenant/system_object.js';
// Global Collection Imports
import { SystemInfos } from '../imports/collections/global/system_info.js';
import { ObjectsList } from '../imports/collections/global/object_list.js';
// Workspace Collection Imports
import { MarketoLeadRecord } from '../imports/collections/workspace/marketo_lead_record.js';

Meteor.startup(function(){

// Remove all collections in development environment when set to true
var clearCollections = false;
if( Meteor.isDevelopment && clearCollections) {
  // Tenant collections
  Workspaces.remove({});
  console.log("Workspaces collection deleted");
  Systems.remove({});
  console.log("Systems collection deleted");
  Objects.remove({});
  console.log("Objects collection deleted");
  // Global collections
  SystemInfos.remove({});
  console.log("SystemInfos collection deleted");
  ObjectsList.remove({});
  console.log("ObjectsList collection deleted");
  // Workspace collections
  MarketoLeadRecord.remove({});
  console.log("MarketoLeadRecord collection deleted");
}

// Remove any system objects on startup as they are a temporary collection
if(SystemObjects.find().count() > 0) {
  SystemObjects.remove({});
  console.log("SystemObjects collection deleted.");
}

sysObjListSet = initSystemObjectsList();
ObjectsList.schema.validate(sysObjListSet[0]);
ObjectsList.schema.validate(sysObjListSet[1]);
ObjectsList.schema.validate(sysObjListSet[2]);
ObjectsList.schema.validate(sysObjListSet[3]);
ObjectsList.schema.validate(sysObjListSet[4]);
ObjectsList.schema.validate(sysObjListSet[5]);
ObjectsList.schema.validate(sysObjListSet[6]);
if(! ObjectsList.findOne()){
  var objlist = [
    sysObjListSet[0],
    sysObjListSet[1],
    sysObjListSet[2],
    sysObjListSet[3],
    sysObjListSet[4],
    sysObjListSet[5],
    sysObjListSet[6]
  ];
  objlist.forEach(function (objli){
    ObjectsList.insert(objli);
  });
}


sysObjSet = initSystemObjects();
Objects.schema.validate(sysObjSet[0]);
Objects.schema.validate(sysObjSet[1]);
Objects.schema.validate(sysObjSet[2]);
Objects.schema.validate(sysObjSet[3]);
Objects.schema.validate(sysObjSet[4]);
if(! Objects.findOne()){
  var objects = [
    sysObjSet[0],
    sysObjSet[1],
    sysObjSet[2],
    sysObjSet[3],
    sysObjSet[4]
  ];
  objects.forEach(function (obj){
    Objects.insert(obj);
  })
}

systemInfosSet = initSystemInfo();
SystemInfos.schema.validate(systemInfosSet[0]);
SystemInfos.schema.validate(systemInfosSet[1]);
SystemInfos.schema.validate(systemInfosSet[2]);
SystemInfos.schema.validate(systemInfosSet[3]);
if(! SystemInfos.findOne()){
  var systeminfos = [
    systemInfosSet[0],
    systemInfosSet[1],
    systemInfosSet[2],
    systemInfosSet[3]
  ];
  systeminfos.forEach(function (systeminfo){
    SystemInfos.insert(systeminfo);
  })
}

workspacesSet = initWorkspaces();
Workspaces.schema.validate(workspacesSet[0]);
Workspaces.schema.validate(workspacesSet[1]);
Workspaces.schema.validate(workspacesSet[2]);
if(! Workspaces.findOne()){
  var workspaces = [
    workspacesSet[0],
    workspacesSet[1],
    workspacesSet[2]
  ];
  workspaces.forEach(function (workspace) {
    Workspaces.insert(workspace);
  })
}

systemSet = initSystems();
Systems.schema.validate(systemSet[0]);
Systems.schema.validate(systemSet[1]);
Systems.schema.validate(systemSet[2]);
Systems.schema.validate(systemSet[3]);
if (! Systems.findOne()){
  var systems = [
    systemSet[0],
    systemSet[1],
    systemSet[2],
    systemSet[3]
  ];
  systems.forEach(function (system) {
    Systems.insert(system);
  })
}

//TODO: fix Datas scema
datasSet = initDatas();
//Datas.schema.validate(datasSet[0]);
//Datas.schema.validate(datasSet[1]);
if (! Datas.findOne()){
  var datas = [ datasSet[0],
    datasSet[1]
  ];
  datas.forEach(function (deet) {
    Datas.insert(deet);
  })
}

var navitemSet = initNavitems();
Navitems.schema.validate(navitemSet[0]);
Navitems.schema.validate(navitemSet[1]);
Navitems.schema.validate(navitemSet[2]);
Navitems.schema.validate(navitemSet[3]);
if (! Navitems.findOne()){
  var navitems = [
    navitemSet[0],
    navitemSet[1],
    navitemSet[2],
    navitemSet[3]
  ];
  navitems.forEach(function (navitem) {
    Navitems.insert(navitem);
  })
}
});

function initWorkspaces(){
  var ArtsWorkspace = {
    tenant_id: 100000,
    id: "000000",
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    is_archived: false,
    name: "Arts' Workspace",
    group_id: "000000"
  };

  var JimsWorkspace = {
    tenant_id: 111111,
    id: "111111",
    modified: new Date(),
    created: new Date(),
    is_deleted: false,
    is_archived: false,
    name: "Jim's' Workspace",
    group_id: "111111"
  };

  var ShaunsWorkspace = {
    tenant_id: 222222,
    id: "222222",
    modified: new Date("2015-07-04T20:06:08.310Z"),
    created: new Date("2015-07-04T20:06:08.310Z"),
    is_deleted: true,
    is_archived: true,
    name: "Shaun's Workspace",
    group_id: "222222"
  };

  return workspaces = [ ArtsWorkspace, JimsWorkspace, ShaunsWorkspace ];
};

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

  return datas = [ Deets, Deeters ];
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

  return navitems = [ Dashboard, Setup, Data, Admin ];
}

function initSystems(){

  // create system objects
  var Netsuite = {
    tenant_id: 000000,
    id: '000000',
    modified: new Date("2015-07-04T20:06:08.310Z"),
    created: new Date("2015-07-04T20:06:08.310Z"),
    is_deleted: false,
    workspace_id: '000000',
    name: 'Netsuite',
    connector_id: '000000',
    system_type: 'bidirectional',
    username: 'username',
    password: 'password',
    dynamic_wsdl_assembly: '000000',
    max_concurrent_tasks: 9,
    prefix: 'NS',
    agent_id: '',
    rev_number: '1.0.0'
  };

  var Marketo = {
    tenant_id: 111111,
    id: '111111',
    modified: new Date("2015-07-04T20:06:08.310Z"),
    created: new Date("2015-07-04T20:06:08.310Z"),
    is_deleted: false,
    workspace_id: '111111',
    name: 'Marketo',
    connector_id: '111111',
    system_type: 'bidirectional',
    username: 'username',
    password: 'password',
    dynamic_wsdl_assembly: '111111',
    max_concurrent_tasks: 8,
    prefix: 'MK',
    agent_id: '',
    rev_number: '1.0.0'
  };

  var Salesforce = {
    tenant_id: 222222,
    id: '222222',
    modified: new Date("2015-07-04T20:06:08.310Z"),
    created: new Date("2015-07-04T20:06:08.310Z"),
    is_deleted: false,
    workspace_id: '222222',
    name: 'Salesforce',
    connector_id: '222222',
    system_type: 'bidirectional',
    username: 'username',
    password: 'password',
    dynamic_wsdl_assembly: '222222',
    max_concurrent_tasks: 7,
    prefix: 'SF',
    agent_id: '',
    rev_number: '1.0.0'
  };

  var Vertify = {
    tenant_id: 333333,
    id: '333333',
    modified: new Date("2015-07-04T20:06:08.310Z"),
    created: new Date("2015-07-04T20:06:08.310Z"),
    is_deleted: false,
    workspace_id: '000000',
    name: 'Vertify',
    connector_id: '333333',
    system_type: 'bidirectional',
    username: 'username',
    password: 'password',
    dynamic_wsdl_assembly: '333333',
    max_concurrent_tasks: 7,
    prefix: 'VF',
    agent_id: '',
    rev_number: '0.0.1'
  };

  return systems = [ Netsuite, Marketo, Salesforce, Vertify ];
};

function initSystemInfo() {

  var Netsuite = {
    id: '000000',
    modified: new Date(),
    created: new Date(),
    name: "Netsuite",
    namespace: "Elixir.Connector.Netsuite",
    default_prefix: "NS",
    requires_agent: false,
    tenant_id: 000000,
    settings: [
      {
        name: "AccountNumber",
        type: "string",
        is_encrypted: false
      }
    ]
  };

  var Marketo = {
    id: '111111',
    modified: new Date(),
    created: new Date(),
    name: "Marketo",
    namespace: "Elixir.Connector.Marketo",
    default_prefix: "MK",
    requires_agent: false,
    tenant_id: 111111,
    settings: [
      {
        name: "EncryptionKey",
        type: "string",
        is_encrypted: false
      },
      {
        name: "StaticList",
        type: "string",
        is_encrypted: false
      }
    ]
  };

  var Salesforce = {
    id: '222222',
    modified: new Date(),
    created: new Date(),
    name: "Salesforce",
    namespace: "Elixir.Connector.Salesforce",
    default_prefix: "SF",
    requires_agent: false,
    tenant_id: 222222,
    settings: [
      {
        name: "SalesforceList",
        type: "string",
        is_encrypted: false
      }
    ]
  };

  var Vertify = {
    id: '333333',
    modified: new Date(),
    created: new Date(),
    name: "Vertify",
    namespace: "Elixir.Connector.Vertify",
    default_prefix: "VF",
    requires_agent: false,
    tenant_id: 333333,
    settings: [
      {
        name: "VertifyObject",
        type: "string",
        is_encrypted: false
      }
    ]
  };

  return [ Netsuite, Marketo, Salesforce, Vertify ];
};

function initSystemObjects() {

  var netsuiteobj = {
    tenant_id: 000000,
    id:  1,
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Netsuite Customer Object",
    object_id: 00,
    system_id: "000000",
    workspace_id: "000000",
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 10000,
    type: "",
    properties: [
      {
  			name: "internalId",
  			is_custom: false,
  			is_array: false,
  			type: "???",
  			is_key: true
  		},  		{
  			name: "company",
  			is_custom: false,
  			is_array: false,
  			type: "???",
  			is_key: false
  		}
    ],
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
    tenant_id: 111111,
    id:  2,
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Marketo Client Object",
    object_id: 10,
    system_id: "111111",
    workspace_id: "111111",
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 10000,
    type: "",
    properties: [
      {
  			name: "internalId",
  			is_custom: false,
  			is_array: false,
  			type: "???",
  			is_key: true
  		},  		{
  			name: "company",
  			is_custom: false,
  			is_array: false,
  			type: "???",
  			is_key: false
  		}
    ],
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
    name: "Marketo Lead Record",
    object_id: 11,
    system_id: "111111",
    workspace_id: "111111",
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 10000,
    type: "",
    properties: [
      {
  			name: "internalId",
  			is_custom: false,
  			is_array: false,
  			type: "???",
  			is_key: true
  		},  		{
  			name: "company",
  			is_custom: false,
  			is_array: false,
  			type: "???",
  			is_key: false
  		}
    ],
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

  var salesforceobj = {
    tenant_id: 222222,
    id:  4,
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Salesforce Object",
    object_id: 20,
    system_id: "222222",
    workspace_id: "222222",
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 10000,
    type: "",
    properties: [
      {
  			name: "internalId",
  			is_custom: false,
  			is_array: false,
  			type: "???",
  			is_key: true
  		},  		{
  			name: "company",
  			is_custom: false,
  			is_array: false,
  			type: "???",
  			is_key: false
  		}
    ],
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
    object_id: 21,
    system_id: "222222",
    workspace_id: "222222",
    last_query: new Date(),
    page_size: 25,
    request_size: 5,
    record_count: 10000,
    type: "",
    properties: [
      {
  			name: "internalId",
  			is_custom: false,
  			is_array: false,
  			type: "???",
  			is_key: true
  		},  		{
  			name: "company",
  			is_custom: false,
  			is_array: false,
  			type: "???",
  			is_key: false
  		}
    ],
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

  return [ netsuiteobj, marketoobj, marketolead, salesforceobj, salesforcecustomer ];
}

function initSystemObjectsList() {

  //NS 0, MK - 1, SF - 2, Vfy - 3

  var netsuitecustomer = {
    id: 00,
    connector_id: "000000",
    name: "Netsuite Customer Object"
  };

  var netsuitelead = {
    id: 01,
    connector_id: "000000",
    name: "Netsuite Lead Object"
  };

  var marketoclient = {
    id: 10,
    connector_id: "111111",
    name: "Marketo Client Object"
  };

  var marketoleadrecord = {
    id: 11,
    connector_id: "111111",
    name: "Marketo Lead Record Object"
  };

  var marketocustomer = {
    id: 12,
    connector_id: "111111",
    name: "Marketo Customer Object"
  };

  var salesforceobj = {
    id: 20,
    connector_id: "222222",
    name: "Salesforce Object"
  };

  var salesforcecustomer = {
    id: 21,
    connector_id: "222222",
    name: "Salesforce Customer Object"
  };

  return [ netsuitecustomer, netsuitelead, marketoclient, marketoleadrecord, marketocustomer, salesforceobj, salesforcecustomer ];
};
