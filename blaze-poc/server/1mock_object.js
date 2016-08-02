function initSystemObjects() {

  var netsuiteobj = {
    tenant_id: "",
    id:  "",
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Netsuite Object",
    system_id: "",
    workspace_id: "",
    last_query: "",
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
    tenant_id: "",
    id:  "",
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Marketo Object",
    system_id: "",
    workspace_id: "",
    last_query: "",
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
    tenant_id: "",
    id:  "",
    modified:  new Date(),
    created:   new Date(),
    is_deleted: false,
    name: "Salesforce Object",
    system_id: "",
    workspace_id: "",
    last_query: "",
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

  return [ netsuiteobj, marketoobj, salesforceobj ];
}
