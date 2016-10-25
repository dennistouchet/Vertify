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
  vertify_object(){
    var ws = Session.get("currentWs");
    var vertifyobjectid = Meteor.tools.getQueryParamByName("id");
    if(ws && vertifyobjectid){
      console.log("vertifyobjectid" + vertifyobjectid);
      var thisVo = VertifyObjects.findOne(vertifyobjectid);
      console.log("thisVo:");
      console.log(thisVo);
      return thisVo.name;
    }
  },
});


Template.alignprocess.events({
  'click' : function(){
    console.log("alignprocess click event");
    //ModalHelper.openAlignConfirmModalFor(sysId);
  },
  'change .radio': function(e, t){
    console.log(e.target);
    var el = e.target.value;

    if(el === "criteria"){
      console.log("show filter");
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

    console.log("calling align task with void: " + vo.id);
    if(ws && vo){
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
    }else{
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ Missing Values ] ws:" + ws.id + " | vo :" + vo + "</li>";

    }
  },
});

Template.alignProcessComplete.helpers({
  align_results(){
    var ws = Session.get("currentWs");
    if(ws){
        //TODO: set by workspace_id once Align results are real
        return AlignResults.findOne({});
    }
    return null;
  },
  getVertifyPropertyName: function(id){
    console.log("getTotal called with: " + id);
    var ws = Session.get("currentWs");
    if(ws && id){
      //TODO: update with real workspace onces using Elixir for results
      var VP = VertifyProperties.findOne({"id": id});//, "workspace_id": ws.id});
      return VP.name;
    }
    //throw error
    return "no name";
  },
  getExternalObjectName: function(id){
    var ws = Session.get("currentWs");
    if(ws){
      //TODO set this up to use workspace once using Elixir for results
      var EO = ExternalObjects.findOne({"id": id});//, "workspace_id": ws.id});
      return EO.name;
    }
    return null;
  }
});

Template.alignProcessComplete.events({
  'change input' : function(e, t){
    if(e.target.type.toLowerCase() == 'radio'){
      var radio = e.target;
      //TODO: verify search
      var alignresults = AlignResults.findOne({"workspace_id": ws.id});
      //TODO: set up how values get set
      if(radio.value == "accept" || radio.value == "reject"){
        console.log("accept/reject: " + radio.value);
        var approved: true;
        //TODO: currently splitting name. clean this code up
        var n = radio.name;

        Meteor.call('align_results.editApproval', ws.id, alignresults._id, n, approved
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
  'click .cancelAlignment': function(e){
    console.log('cancel alignment clicked');
    FlowRouter.go('/setup/align');
  },
  'click .acceptAlignModal': function(e){
    e.preventDefault();
    var errDiv = document.getElementById("addErrAlign");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    var vertifyobjectid = Meteor.tools.getQueryParamByName("id");
    var ws = Session.get("currentWs");
    //TODO: verify search and add workspace "workspace_id": ws.id
    var alignresults = AlignResults.findOne({});

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
      Meteor.call('align_results.updateName', ws.id, alignresults._id, n, fn  , (err, res) => {
          if(err){
            //console.log(err);
            errDiv.style.display = 'block';
            errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ AlignResult " + err.error + "] " + err.reason + "</li>";
            //return false;
            err = true;
          }else {
            //success
          }
        });
    });
    //Only open modal if no update errors occured.
    if(!err){
      ModalHelper.openAlignConfirmModalFor(vertifyobjectid, alignresults.id);
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
