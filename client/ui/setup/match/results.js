import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';

import './results.html';

Template.matchresults.onCreated(function(){
  var vo_id = FlowRouter.getQueryParam("id");
  console.log("oncreate void: " +vo_id);
  Template.instance().vertify_object_id = new ReactiveVar(vo_id);
  Template.instance().workspace_id = new ReactiveVar( Session.get("currentWs")._id);
  /*
  this.autorun(function(){
    if(vertify_object_id.get() && workspace_id.get()){
      var collection_name = workspace_id.get() + vertify_object_id.get();
      this.subscribe(collection_name, function(){
        console.log( "Match/Results - " + collection_name + " now subscribed." );
      });
    }
  });
  */
});

Template.matchresults.helpers({
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
});

Template.matchresults.events({
  'click' : function(){
    console.log("match results page click event");
  },
});
