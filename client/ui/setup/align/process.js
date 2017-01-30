import { Template } from 'meteor/templating';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js'
import { AlignResults } from '../../../../imports/collections/workspace/align_result.js'

import './process.html';

Template.alignprocess.onCreated(function(){
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

  //Alignment click through process for AlignTest/Align
  this.currentPage = new ReactiveVar("alignprocessaligntest"); //other Page is alignprocessalign

  // Get vertify object id from query parameters in url
  var vo_id = FlowRouter.getQueryParam("id");
  this.vo_id = new ReactiveVar(vo_id);
});

Template.alignprocess.helpers({
  aprocess(){
    return Template.instance().currentPage.get();
  },
  properties(){
    //TODO:
    return;
  },
  getVertifyObjectName: function(){
    var ws = Session.get('currentWs');
    var id = Template.instance().vo_id.get();
    if(ws && id){
      var vo = VertifyObjects.findOne(id, {"workspace_id": ws._id});
      if(vo)
        return vo.name;
    }
  },
});


Template.alignprocess.events({
  'click' : function(){
    console.log("alignprocess click event");
    //ModalHelper.openAlignConfirmModalFor(sys_id);
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
    errDiv.innerHtml = ''; //reset errors

    ws = Session.get('currentWs');
    var id = Template.instance().vo_id.get();
    var vo = VertifyObjects.findOne(id);

    //console.log("calling align task with void: " + vo._id);
    if(ws && vo){
      Meteor.call('align_results.remove', ws._id, vo._id
      , (err, res) => {
        if(err){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + '<li><span>Align Results Error: </span>[ remove ' + err.error + '] ' + err.reason + '</li>';
          //return false;
          return;
        }
        else {
          //console.log("align_results remove returned success");
          Meteor.call('tasks.insert', "aligntest", ws._id, vo._id
          , (error, result) => {
            if(error){
              //console.log(err);
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + '<li><span>Task Error: </span>[ aligntest ' + error.error + '] ' + error.reason + '</li>';
              //return false;
              return;
            }
            else {
              t.currentPage.set( "alignprocessalign" );
            }
          });
        }
      });
    }else{
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[ Missing Values ] Please click cancel and retry the alignment.</li>';
    }
  },
  'click .back': function(e){
    console.log('Cancel alignment clicked');
    FlowRouter.go('/setup/align');
  },
  'click .preAlignModal' : function(e, t){
      e.preventDefault();
      t.currentPage.set( "alignprocessalign" );
  },
});

Template.alignprocessalign.helpers({
  taskComplete: function(){
    var ws = Session.get('currentWs');
    var id = Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne(id);
    complete = false;
    if(ws && vo){
      var ar = AlignResults.findOne({"workspace_id": ws._id, "vertify_object_id": vo._id});
      if(ar){
        complete = true;
      }
    }
    return complete;
  },
  align_results(){
    var ws = Session.get('currentWs');
    var id =Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne(id);
    if(ws && vo){
        return AlignResults.findOne({"workspace_id": ws._id, "vertify_object_id": vo._id});
    }
    return;
  },
  approvedPropertyCount(id){
    var AR = AlignResults.findOne(id);
    let count = 0;
    if(AR){
      AR.alignment_properties.forEach( field => {
        if(field.approved)
          count += 1;
      });
    }
    return count;
  },
  getVertifyPropertyName: function(vp_id){
    var ws = Session.get('currentWs');
    var id = Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne(id);
    if(ws && vo && vp_id){
      var vp = VertifyProperties.findOne(vp_id,{"workspace_id": ws._id, "vertify_object_id": vo._id});
      if (vp)
        return vp.name;
    }
    //throw error
    return "no name";
  },
  getExternalObjectName: function(eo_id){
    var ws = Session.get('currentWs');
    if(ws && eo_id){
      var eo = ExternalObjects.findOne(eo_id,{"workspace_id": ws._id});
      if(eo)
        return eo.name;
    }
    return;
  }
});

Template.alignprocessalign.events({
  'change input' : function(e, t){
    console.log('Align Process - input changed.');
    var errDiv = document.getElementById("addErrAlign");
    errDiv.style.display = 'none';
    errDiv.innerHtml = ''; //reset errors

    var ws = Session.get('currentWs');
    var id = Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne(id);
    if(ws && vo){
      if(e.target.type.toLowerCase() == 'radio'){
        var radio = e.target;
        var ar = AlignResults.findOne({"workspace_id": ws._id, "vertify_object_id": vo._id});
        var approved = false;
        if(radio.value == "accept" || radio.value == "reject"){
            if(radio.value == "accept"){
            approved = true;
          }else{
            approved = false;
          }
          var n = radio.name;
          //console.log("ws: " + ws._id + " | ar: " + ar._id + " | n: " + n.substr(11) + " | app: " + approved);
          //console.log(typeof ar._id);
          //console.log(ar._id);
          Meteor.call('align_results.editApproval', ws._id, ar._id, n.substr(11), approved
          , (err, res) => {
              if(err){
                //console.log(err);
                errDiv.style.display = 'block';
                errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[ AlignResult ' + err.error + '] ' + err.reason + '</li>';
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
    }
    else{
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[ Missing Value ] Please verify that a workspace has been selected. If this error persists, return to the previous screen and try again.</li>';
    }
  },
  'click .viewAlignment' : function(e){
    var errDiv = document.getElementById("addErrAlign");
    errDiv.style.display = 'none';
    errDiv.innerHtml = ''; //reset errors

    FlowRouter.go('/setup/align/results?id=' + Meteor.tools.getQueryParamByName("id"));
  },
  'click .acceptAlignModal': function(e){
    e.preventDefault();
    var errDiv = document.getElementById("addErrAlign");
    errDiv.style.display = 'none';
    errDiv.innerHtml = ''; //reset errors

    var vertifyobjectid = Meteor.tools.getQueryParamByName("id");
    var ws = Session.get('currentWs');
    var vo = VertifyObjects.findOne(vertifyobjectid,{"workspace_id":ws._id});
    if(ws && vo)
    {
      var alignresults = AlignResults.findOne({"workspace_id": ws._id,"vertify_object_id": vo._id});

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
        Meteor.call('align_results.updateName', ws._id, alignresults._id, n, fn
        , (err, res) => {
            if(err){
              //console.log(err);
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[ AlignResult ' + err.error + '] ' + err.reason + '</li>';
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
