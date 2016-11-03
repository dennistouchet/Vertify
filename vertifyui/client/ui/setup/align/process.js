import { Template } from 'meteor/templating';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js'
import { AlignResults } from '../../../../imports/collections/workspace/align_result.js'

import './process.html';

Template.alignprocess.onCreated(function(){
  this.currentPage = new ReactiveVar("alignProcessZeroData"); //other Page is alignProcessComplete
});

Template.alignprocess.helpers({
  aprocess(){
    return Template.instance().currentPage.get();
  },
  properties(){
    //TODO:
    return null;
  },
  getVertifyObjectName: function(){
    var ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    if(ws && id){
      console.log("vertify_object id from param:" + id);
      var vo = VertifyObjects.findOne(id).name;
      return vo.name;
    }
  },
});


Template.alignprocess.events({
  'click' : function(){
    console.log("alignprocess click event");
    //ModalHelper.openAlignConfirmModalFor(sysId);
  },
  'change .radio': function(e, t){
    var el = e.target.value;

    if(el === "criteria"){
      document.getElementById(("filterCriteria")).style.display = "inline";
    }
    else if(el === "count"){
      document.getElementById(("filterCriteria")).style.display = "none";
    }
  },
  'click .align' : function(e, t){
    console.log('Align Process - align event clicked.');
    var errDiv = document.getElementById("addErrAlign");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne({"_id": id});

    //console.log("calling align task with void: " + vo.id);
    if(ws && vo){
      Meteor.call('align_results.remove', ws.id
      , (err, res) => {
        if(err){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Align Results Error: </span>[ remove " + err.error + "] " + err.reason + "</li>";
          //return false;
          return;
        }
        else {
          //console.log("align_results remove returned success");
          Meteor.call('tasks.insert', "aligntest", ws.id, vo.id
          , (error, result) => {
            if(error){
              //console.log(err);
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ aligntest " + error.error + "] " + error.reason + "</li>";
              //return false;
              return;
            }
            else {
              t.currentPage.set( "alignProcessComplete" );
            }
          });
        }
      });
    }else{
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Missing Values ] Please click cancel and retry the alignment.</li>";
    }
  },
  'click .toAlign': function(e){
    console.log('Cancel alignment clicked');
    FlowRouter.go('/setup/align');
  },
});

Template.alignProcessComplete.helpers({
  taskComplete: function(){
    var ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne(id);
    complete = false;
    if(ws && vo){
      var ar = AlignResults.findOne({"workspace_id": ws.id, "vertify_object_id": vo.id});
      if(ar){
        complete = true;
      }
    }
    return complete;
  },
  align_results(){
    var ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne(id);
    if(ws && vo){
        return AlignResults.findOne({"workspace_id": ws.id, "vertify_object_id": vo.id});
    }
    return null;
  },
  getVertifyPropertyName: function(id){
    console.log("getTotal called with: " + id);
    var ws = Session.get("currentWs");
    if(ws && id){
      var VP = VertifyProperties.findOne({"id": id, "workspace_id": ws.id});
      return VP.name;
    }
    //throw error
    return "no name";
  },
  getExternalObjectName: function(id){
    var ws = Session.get("currentWs");
    if(ws){
      var EO = ExternalObjects.findOne({"id": id, "workspace_id": ws.id});
      return EO.name;
    }
    return null;
  }
});

Template.alignProcessComplete.events({
  'change input' : function(e, t){
    if(e.target.type.toLowerCase() == 'radio'){
      var radio = e.target;
      var alignresults = AlignResults.findOne({"workspace_id": ws.id});
      var approved: false;
      if(radio.value == "accept" || radio.value == "reject"){
          if(radio.value == "accept"){
          approved = true;
        }else{
          approved: false;
        }
        var n = radio.name;
        Meteor.call('align_results.editApproval', ws.id, alignresults._id, n.substr(11), approved
        , (err, res) => {
            if(err){
              //console.log(err);
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ AlignResult " + err.error + "] " + err.reason + "</li>";
              //return false;
            }else {
              //success
            }
          });
      }
      else {
        //throw error
      }
    }
  },
  'click .viewAlignment': function(e){
    //TODO:
  },
  'click .acceptAlignModal': function(e){
    e.preventDefault();
    var errDiv = document.getElementById("addErrAlign");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    var vertifyobjectid = Meteor.tools.getQueryParamByName("id");
    var ws = Session.get("currentWs");
    var vo = VertifyObjects.findOne(vertifyobjectid,{"workspace_id":ws.id});
    if(ws && vo)
    {
      var alignresults = AlignResults.findOne({"workspace_id": ws.id,"vertify_object_id": vo.id});

      //Get all inputs with type text to set friendly_name
      var inputs = document.getElementsByTagName('input');
      var nameInputs = [];
      for(var i = 0; i < inputs.length; i++){
        if(inputs[i].type.toLowerCase() == 'text'){
            //TODO: Validate Inputs
            nameInputs.push(inputs[i]);
        }
      }
      var err = false;
      nameInputs.forEach(function(input){
        var n = input.name;
        var fn = input.value;
        //TODO: align ids being used
        Meteor.call('align_results.updateName', ws.id, alignresults._id, n, fn
        , (err, res) => {
            if(err){
              //console.log(err);
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ AlignResult " + err.error + "] " + err.reason + "</li>";
              //return false;
              err = true;
            }else {
              //TODO: align ids being used
              ModalHelper.openAlignConfirmModalFor(vertifyobjectid, alignresults.id);
            }
          });
      });
    }
  }
});

Meteor.subscribe('external_objects', function (){
  console.log( "Align/Process - VertifyObjects now subscribed." );
});

Meteor.subscribe('vertify_objects', function (){
  console.log( "Align/Process - VertifyObjects now subscribed." );
});

Meteor.subscribe('vertify_properties', function (){
  console.log( "Align/Process - VertifyProperties now subscribed." );
});

Meteor.subscribe('align_results', function (){
  console.log( "Align/Process - AlignResults now subscribed." );
});
