import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const MarketoLeadRecord = new Mongo.Collection('marketo_lead_record');

Meteor.methods({
  'marketo_lead_record.insert'(i, o, c, u, e, lo, li){
    check(i, String);
    check(o, Boolean);
    check(c, Boolean);
    check(u, Boolean);
    check(e, Boolean);
    check(lo, String);
    check(li, String);

    //TODO: add schema validation

    MarketoLeadRecord.insert({
      "metadata.id": i,
      "metadata.is_original": o,
      "metadata.is_created": c,
      "metadata.is_uploaded": u,
      "metadata.is_error": e,
      "links.$.object_id": li,
      "links.$.id": li,
    });
  }
});

MarketoLeadRecord.attachSchema(new SimpleSchema({

  "metadata.id":
    { type: String
      , label: "Id"
    },
  "metadata.is_original":
    { type: Boolean
      , label: "Is Original"
    },
  "metadata.is_created":
    { type: Boolean
      , label: "Is Created"
    },
  "metadata.is_uploaded":
    { type: Boolean
      , label: "Is Uploaded"
    },
  "metadata.is_error":
    { type: Boolean
      , label: "Is Error"
    },
  "metadata.error_Text":
    { type: String
      , label: "Error Text"
    },
  "metadata.fields_to_null":
    { type: String
      , label: "Fields to Null"
    },
  "metadata.created":
    { type: Date
      , label: "Created"
    },
  "metadata.modified":
    { type: Date
      , label: "Modified"
    },
  "metadata.last_collected":
    { type: Date
      , label: "Last Collected"
    },
  "metadata.ignore":
    { type: Boolean
      , label: "Ignore"
    },
  "links.$.object_id":
    { type: String
      , label: "Links Object Id"
    },
  "links.$.id":
    { type: String
      , label: "Links ID"
    },
  "data.Id":
    { type: String
      , label: "Data Id"
    },
  "data.Email":
    { type: String
      , label: "Data Email"
    },
  "data.CompanyId":
    { type: String
      , label: "Data Company Id"
    },
  "data.leadAttributeList.$.attrName":
    { type: String
      , label: "Data Lead Attr Name"
    },
  "data.leadAttributeList.$.attrType":
    { type: String
      , label: "Data Lead Attr Type"
    },
  "data.leadAttributeList.$.attrValue":
    { type: String
      , label: "Data Lead Attr Valie"
    },
  //"data.Addresses":
  //  { type: [Object]
  //    , label: "Data Addresses"
//},
}));
