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
  console.log("oncreate void: " +vo_id);
  var ws = Session.get("currentWs");
  Template.instance().vertify_object_id = new ReactiveVar(vo_id);
  Template.instance().workspace_id = new ReactiveVar(ws._id);

  if(ws && vo_id){
    var matchresults_collection_name = ws._id + "_" + vo_id;
    var exists = Meteor.connection._stores[matchresults_collection_name];
    if(exists ==  null){
      MatchData = new Mongo.Collection(matchresults_collection_name);
      TabularTables.MatchData = new Tabular.Table({
        name: "MatchData",
        collection: MatchData,
        columns: [
          {data: "_id", title: "ID", class: "col-md-3"},
          {data: "data", title: "Data", class: "col-md-3"},
          {data: "links", title: "Links", class: "col-md-3"}
        ]
      });
    }

    Meteor.call('publishMatchResults', ws._id, matchresults_collection_name
    , (err, res) => {
      if(err){
          //TODO: error
      }else{
        mrhandle = Meteor.subscribe(matchresults_collection_name, function (){
                     console.log( mrhandle );
                   });
      }
    });
  }
  else{
    console.log("Missing ws or vo:" + ws._id + "|" +vo_id);
  }
});

Template.matchresults.helpers({
  isReady: function(){
    return false;
  },
  vertify_object_id : function(){
    var ws = Session.get("currentWs");
    if(ws)
    {
      var collection_name = Template.instance().workspace_id.get() + "_" + Template.instance().vertify_object_id.get();
      return collection_name;
    }
  },
  vertify_obj(){
    var ws = Session.get("currentWs");
    if(ws)
    {
      return vertify_obj = VertifyObjects.findOne({workspace_id: ws._id});
    }
  },
  match_results(){
    //console.log("inside mr helper:");
    //console.log(VertifyObjects);
    console.log(MatchData);
    return MatchData.find();
  }
});

Template.matchresults.events({
  'click' : function(){
    console.log("match results page click event");
  },
});
