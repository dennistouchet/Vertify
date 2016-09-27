import { Template } from 'meteor/templating';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js'

import './align.html';

Template.align.helpers({
  hasVertifyObjects: function(){
    return false;
  },
  alignCompleted: function(){
    return false;
  },
  hasProperties(){
    return false;
  }
});


Template.align.events({

});

Template.alignVertifyObjects.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      //TODO: figure out how to check if approved
      return VertifyObjects.find({"workspace_id": ws.id});
    }
    return VertifyObjects.find();
  },
  vertify_properties(){
    var ws = Session.get("currentWs");
    if(ws){
      //TODO: figure out how to check if approved
      return VertifyProperties.find({"workspace_id": ws.id});
    }
    //TODO: remove this once align is complete
    return VertifyProperties.find();;
  },
  external_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      return ExternalObjects.find({"workspace_id": ws.id});
    }
    return null;
  },
});

Template.alignVertifyObjectli.helpers({
  getExternalObjectName : function(eo_id){
    var ws = Session.get("currentWs");
    var eo = ExternalObjects.findOne({"id": parseInt(eo_id), "workspace_id": ws.id});
    return eo.name;
  },
});

Template.alignVertifyObjectli.events({
  'click .voddl li a' : function(e, t){
    console.log("dropdown event clicked:");
    console.log(e.target);
    if(e.target.text.trim() == 'Align'){
      FlowRouter.go('/setup/align/process?id=' + this._id);
    }
    else{
      console.log(e.target.text);
    }
  },
})

Template.alignCompleted.helpers({

});

Template.alignCompleted.events({

});

Meteor.subscribe('external_objects', function (){
  console.log( "Match - ExternalObjects now subscribed.");
});

Meteor.subscribe('vertify_objects', function (){
  console.log( "Align - VertifyObjects now subscribed.");
});

Meteor.subscribe('vertify_properties', function (){
  console.log( "Align - VertifyProperties now subscribed.");
});
