import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const MatchSetup = new Mongo.Collection('match_setup');

Meteor.methods({
  'match_setup.insert'(wsid, step, newobj){
    if(step != "vwStart"){
      throw new Meteor.Error("Error","vwStart insert error");
    }
    check(wsid, String);
    check(newobj, Boolean);

    var ms = MatchSetup.findOne({}, {sort: {id: -1}});
    var newid = null;

    if(ms == null){
      newid = 1;
    }
    else {
      newid = ms.id + 1;
    }

    msitem = {
      id: newid,
      workspace_id: wsid,
      new_object: newobj
    }

    MatchSetup.schema.validate(msitem);
    MatchSetup.insert(msitem);
    return msitem.id;
  },
  'match_setup.remove'(id, wsid){
    console.log("match_setup.remove");
    check(id, Number);
    check(wsid, String);

    var current = MatchSetup.findOne({"id": id, "workspace_id": wsid});
    MatchSetup.remove(current);
  },
  'match_setup.selectedit'(id, wsid, step ){
    if(step != "vwSelect"){
      throw new Meteor.Error("Error","vwSelect edit error");
    }
    check(wsid, String);
    check(id, Number);


    console.log("match_setup.selectedit: " + step );
  },
  'match_setup.filteredit'(id, wsid, step ){
    if(step != "vwFilter"){
      throw new Meteor.Error("Error","vwFilter edit error");
    }
    check(wsid, String);
    check(id, Number);

    console.log("match_setup.filteredit: " + step );
  },
  'match_setup.matchedit'(id, wsid, step ){
    if(step != "vwMatch"){
      throw new Meteor.Error("Error","vwMatch edit error");
    }
    check(wsid, String);
    check(id, Number);

    console.log("match_setup.matchedit: " + step );
  },
  'match_setup.finishedit'(id, wsid, step ){
    if(step != "vwFinish"){
      throw new Meteor.Error("Error","vwFinish edit error");
    }
    check(wsid, String);
    check(id, Number);

    console.log("match_setup.finishedit: " + step );
    //TODO Call Vertify_Object creation here?
  },
});

RecordsCriteriaSchema = new SimpleSchema({
  value1:
    { type: String },
  operator:
    { type: String },
  value2:
    { type: String }
});

MatchFieldSchema = new SimpleSchema({
  field1 :
    { type : String },
  match_percentage:
    { type: Number,
      allowedValues: [ 100, 99 ] },
  field1 :
    { type : String }
});

MatchSetup.schema = new SimpleSchema({
  id:
    { type: Number },
  workspace_id:
    { type: String },

  //Start Options
  new_object:
    { type: Boolean  },
  vo_id:
    { type: String,
      optional: true  },

  //Select Options
  eo_id_1:
    { type: String,
      optional: true  },
  eo_id_2:
    { type: String,
      optional: true  },

  //Filter Options
  eo1_vertify_all:
    { type: Boolean,
      optional: true  },
  eo2_vertify_all:
    { type: Boolean,
      optional: true  },
  eo1_criteria:
    { type: [RecordsCriteriaSchema],
      optional: true },
  eo2_criteria:
    { type: [RecordsCriteriaSchema],
      optional: true  },

  //Match Options
  match_fields:
  { type: [MatchFieldSchema],
    minCount: 1,
    optional: true  },

  //Finish Options
  vo_name:
    { type: String,
      optional: true  },
  system_of_truth:
    { type: String,
      optional: true  }
});
