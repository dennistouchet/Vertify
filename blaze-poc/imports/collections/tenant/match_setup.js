import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const MatchSetup = new Mongo.Collection('match_setup');

//TODO: FOR EACH STEP, ON UPDATE/EDIT, RESET FOLLOW STEP VALUES TO NULL

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
    console.log("ms insert: " +msitem.id + " | newobj: " + msitem.new_object);
    return msitem.id;
  },
  'match_setup.startedit'(msid, wsid, step, newobj ){
    if(step != "vwStart"){
      throw new Meteor.Error("Error","vwStart edit error");
    }
    check(wsid, String);
    check(msid, Number);
    check(newobj, Boolean);

    var thisMatch = MatchSetup.findOne({"workspace_id": wsid, "id": msid});
    MatchSetup.update(thisMatch._id, {
      $set: {new_object: newobj },
    });
    console.log("ms update: " +msitem.id + " | newobj: " + newobj);
  },
  'match_setup.selectedit'(id, wsid, step, extobjids ){
    if(step != "vwSelect"){
      throw new Meteor.Error("Error","vwSelect edit error");
    }
    check(wsid, String);
    check(id, Number);
    check(extobjids, [Number]);

    console.log("select update called");

    var thisMatch = MatchSetup.findOne({"workspace_id": wsid, "id": id});
    if(thisMatch){
      if(extobjids.length == 2 && thisMatch.new_object)
      {
        MatchSetup.update(thisMatch._id, {
          $set: {eo_ids: extobjids},
        });
      } else if(extobjids.length == 1 && !thisMatch.new_object) {
        MatchSetup.update(thisMatch._id, {
          $set: {eo_ids: extobjids},
        });
      }
      else {
        throw new Meteor.Error("Error", "Encountered a problem with the selected objects. Please try again.");
      }
    }else {
      throw new Meteor.Error("Error", "Encountered an issue with the match process objects. Please try again.");
    }
    console.log("match_setup.selectedit: " + step );
  },
  'match_setup.filteredit'(id, wsid, step, r1, r2, fc1, fc2){
    if(step != "vwFilter"){
      throw new Meteor.Error("Error","vwFilter edit error");
    }
    check(wsid, String);
    check(id, Number);
    check(r1, Boolean);
    check(r2, Boolean);

    if(!r1){
        throw new Meteor.Error("Error", "Filter options are currently unsupported.");
    }
    else if(!r2){
      throw new Meteor.Error("Error", "Filter options are currently unsupported.");
    }

    var thisMatch = MatchSetup.findOne({"id": id, "workspace_id": wsid});
    if(thisMatch){
      MatchSetup.update(thisMatch._id, {
        $set: {eo1_vertify_all: r1, eo2_vertify_all: r2
          , eo1_criteria : fc1, eo1_criteria: fc2 },
      });
    }
    console.log("match_setup.filteredit: " + step );
  },
  'match_setup.matchedit'(id, wsid, step, match_criteria){
    if(step != "vwMatch"){
      throw new Meteor.Error("Error","vwMatch edit error");
    }
    check(wsid, String);
    check(id, Number);

    for(var i = 0; i < match_criteria.length; i++)
    {
      MatchFieldSchema.validate(match_criteria[i]);
    }

    var thisMatch = MatchSetup.findOne({"id": id, "workspace_id": wsid});
    if(thisMatch){
      MatchSetup.update(thisMatch._id, {
        $set: { match_fields: match_criteria },
      });
    }
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
  'match_setup.remove'(id, wsid){
    console.log("match_setup.remove");
    check(id, Number);
    check(wsid, String);

    var current = MatchSetup.findOne({"id": id, "workspace_id": wsid});
    MatchSetup.remove(current);
  },
  'match_setup.removeall'(wsid){
    console.log("match_setup.removeall");
    check(wsid, String);

    MatchSetup.remove({"workspace_id": wsid});
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
      allowedValues: [ 100 ] },
  field2 :
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
  eo_ids:
    { type: [Number],
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
