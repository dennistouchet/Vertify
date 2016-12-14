  import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import Tabular  from 'meteor/aldeed:tabular';
import { TabularTables } from '../../../../lib/datalist.js';

import './results.html';

let mrhandle = null;
let MatchData = null;

Template.matchresults.onCreated(function(){
  var vo_id = FlowRouter.getQueryParam("id");
  var ws = Session.get("currentWs");
  Template.instance().vertify_object_id = new ReactiveVar(vo_id);
  Template.instance().workspace_id = new ReactiveVar(ws._id);

  if(ws && vo_id){
    var matchresults_collection_name = ws._id + "_" + vo_id;
    console.log("collection name:",matchresults_collection_name);
    var exists = Meteor.connection._stores[matchresults_collection_name];
    console.log("store by name",Meteor.connection._stores[matchresults_collection_name]);
    if(exists ==  null){
      MatchData = new Mongo.Collection(matchresults_collection_name);
      /*
      TabularTables.MatchData = new Tabular.Table({
        name: "MatchData",
        collection: MatchData,
        columns: [
          {data: "_id", title: "ID", class: "col-md-3"},
          {data: "data", title: "Data", class: "col-md-3"},
          {data: "links", title: "Links", class: "col-md-3"}
        ]
      });
      */
    }

    Meteor.call('publishMatchResults', ws._id, matchresults_collection_name
    , (err, res) => {
      if(err){
          //TODO: error
      }else{
        // NOTE: the publication of match results is limited to ACTUAL matches
        // not ALL match results
        mrhandle = Meteor.subscribe( matchresults_collection_name
                   , function (){ console.log( "Match/Results - MatchData dynamically subscribed." ); });
      }
    });
  }
  else{
    console.log("Missing ws or vo:" + ws._id + "|" +vo_id);
  }
});

Template.matchresults.helpers({
  vertify_obj(){
    var ws = Session.get("currentWs");
    if(ws)
    {
      return vertify_obj = VertifyObjects.findOne({workspace_id: ws._id});
    }
  },
  match_data(){
    //console.log("inside mr helper:");
    //console.log(VertifyObjects);
    console.log(MatchData);
    // Filter by ws and vo_id even though name relies on them?
    if(MatchData)
      return MatchData.find({});
  },
  matchedDataCount: function(){
    if(MatchData)
      var md = MatchData.find({});
    if(md)
      return md.count();
  },
  vertify_object_id : function(){
    var ws = Session.get("currentWs");
    if(ws)
    {
      var collection_name = Template.instance().workspace_id.get() + "_" + Template.instance().vertify_object_id.get();
      return collection_name;
    }
  },
  isReady: function(){
    return false;
  },
  hasData : function(_id){
    return false;
  },
});

Template.matchresults.events({
  'click' : function(){
    console.log("match results page click event");
  },
  'click .back' : function(e){
    FlowRouter.go('/setup/match/process?id='+ Template.instance().vertify_object_id.get());
  }
});
