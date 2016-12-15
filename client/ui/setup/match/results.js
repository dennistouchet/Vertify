  import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import Tabular  from 'meteor/aldeed:tabular';
import { TabularTables } from '../../../../lib/datalist.js';

import './results.html';

var mrhandle = null;
var MDict = [];

Template.matchresults.onCreated(function(){
  var vo_id = FlowRouter.getQueryParam("id");
  var ws = Session.get("currentWs");
  if(ws && vo_id){
    Template.instance().vertify_object_id = new ReactiveVar(vo_id);
    Template.instance().workspace_id = new ReactiveVar(ws._id);
    var name = ws._id + "_" + vo_id;
    //var exists = Meteor.connection._stores[name];
    //console.log("store by name",Meteor.connection._stores[name]);
    //console.log("Client MDict[name]: ", MDict[name]);
    if(MDict[name] == undefined){
      MDict[name] = new Mongo.Collection(name);
      /*
      TabularTables.MatchData = new Tabular.Table({
        name: "MatchData",
        collection: MDict[name],
        columns: [
          {data: "_id", title: "ID", class: "col-md-3"},
          {data: "data", title: "Data", class: "col-md-3"},
          {data: "links", title: "Links", class: "col-md-3"}
        ]
      });
      */
    }
    Meteor.call('publishMatchResults', ws._id, name
    , (err, res) => {
      if(err){
          //TODO: error
          console.log("Publish error",err.error,err.reason);
      }else{
        // NOTE: the publication of match results is limited to ACTUAL matches
        // not ALL match results
        mrhandle = Meteor.subscribe( name
        , function (){ console.log( "Match/Results - MDict[name] dynamically subscribed with: ",name); });
      }
    });
  }
  else{
    console.log("Missing ws or vo");
  }
});

Template.matchresults.helpers({
  vertify_obj(){
    var ws = Session.get("currentWs");
    if(ws)
    {
      return vertify_obj = VertifyObjects.findOne({"workspace_id": ws._id});
    }
  },
  match_data(){
    var ws = Session.get("currentWs");
    if(ws)
    {
      var vo_id = Template.instance().vertify_object_id.get();
      var name = ws._id + "_" + vo_id;
      //console.log("Client Helper:", MDict[name]);
      if(MDict[name])
        return MDict[name].find({"workspace_id": ws._id, "vertify_object_id": vo_id, num_links: {$gt: 1}});
    }
  },
  matchedDataCount: function(){
    var ws = Session.get("currentWs");
    if(ws){
      var vo_id = Template.instance().vertify_object_id.get();
      var name = Template.instance().workspace_id.get() + "_" + vo_id;
      if(MDict[name])
        var md = MDict[name].find({"workspace_id": ws._id, "vertify_object_id": vo_id, num_links: {$gt: 1}});
      if(md)
        return md.count();
    }
  },
  isReady: function(){
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
