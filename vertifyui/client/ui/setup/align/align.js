import { Template } from 'meteor/templating';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js'

import './align.html';

Template.align.helpers({
  hasObjects: function(){
    var ws = Session.get("currentWs");
    var valid = false;
    if(ws){
      var count = VertifyObjects.find({"workspace_id": ws.id, "match": true}).count();
      if(count > 0){
        valid = true;
      }
    }
    return valid;
  },
  isAligned: function(){
    var ws = Session.get("currentWs");
    return Meteor.tools.alignStatus(ws.id);
  },
});

Template.align.events({
  'click .toMatch': function(){
    FlowRouter.go('/setup/match');
  }
})

Template.alignVertifyObjects.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      //TODO: figure out how to check if approved
      return VertifyObjects.find({"workspace_id": ws.id, "match": true});
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
    var errDiv = document.getElementById("addErrAlign");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    console.log("dropdown event clicked:");
    console.log(e.target);
    if(e.target.text.trim() == 'Align'){
      FlowRouter.go('/setup/align/process?id=' + this._id);
    }
    else if(e.target.text.trim() == 'Properties'){
      FlowRouter.go('/setup/align/fieldeditor?id=' + this._id);
    }
    else if(e.target.text.trim() == 'Delete')
    {
      var vo = VertifyObjects.findOne(this._id);
      var count = VertifyProperties.find({"workspace_id": vo.workspace_id, "vertify_object_id": vo.id}).count();

      if(count > 0){
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Existing Dependencies ] Must delete all Vertify Properties before deleting a Vertify Object. </li>";
      }
      else{
      Meteor.call('tasks.insert', 'deletevertifyobject', ws.id, vo.id
      , (err, res) => {
        if(err){
          //console.log(err);
          //TODO: improve with error Template
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Task " + err.error + "] " + err.reason + "</li>";
        }else{
          console.log("Task deletevertifyobject called");
          //success
          //TODO This should be done and elixir monitors and dleetes data
          /*
          Meteor.call('vertify_objects.remove', ws.id, this._id
          , (error, result) => {
            if(error){
              //console.log(err);
              //TODO: T
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + error.error + "] " + error.reason + "</li>";
            }else{
              //success
              //TODO Need a call to remove
              //all Vertify Properties associate with this VO
            }
          });
          */
          }
        });
      }
    }
    else
    {
      console.log(e.target.text);
    }
  },
})

Template.alignCompleted.helpers({
 vertifyObjectCount: function(){
   var ws = Session.get("currentWs");
   if(ws){
     return VertifyObjects.find({"workspace_id": ws.id}).count();
   }
 }
});

Template.alignCompleted.events({
    'click .toAlign': function(){
      FlowRouter.go('/data/analyze');
    }
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
