import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { MatchResults } from '../../../../imports/collections/workspace/match_result.js';
import { Systems } from  '../../../../imports/collections/tenant/system.js';

import './process.html';

Template.process.onCreated(function(){
  Meteor.subscribe('vertify_objects', function (){
    console.log( "Match/Process - VertifyObjects now subscribed." );
  });

  Meteor.subscribe('match_results', function (){
    console.log( "Match/Process - MatchResults now subscribed." );
  });

  this.currentPage = new ReactiveVar("processZeroData"); //other Page is matchProcessComplete
});


Template.process.helpers({
  mprocess() {
    return Template.instance().currentPage.get();
  },
  properties(){
    //TODO: get vertify object properties
    return false;
  },
  getVertifyObjectName: function(){
    //TODO: fix this. It tries to get the ID before the template is rendered and the queryparams are set so it fails
    var ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    if(ws && id){
      console.log("vertify_object id from param:" + id);
      var vo = VertifyObjects.findOne(id).name;
      console.log("Vertify object from getVertObjName:");
      console.log(vo);
      return vo.name;
    }
    return null;
  },
});

Template.process.events({
  'click' : function(){
    console.log("process click event");
    //ModalHelper.openMatchConfirmModalFor(sysId);
  },
  'change input': function(e, t){
    //TODO: change this event so it only happens on the radio buttons and not other inputs
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
  'click .match' : function(e, t){
    console.log('Process - match event clicked.');
    var errDiv = document.getElementById("addErrMatch");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne({"_id": id});

    //TODO: Send results ID
    if(ws && vo){

      //DEVENV TODO this needs to be changed for dev environmkent static mock results
      Meteor.call('match_results.remove', ws._id
      , (error, result) => {
        if(error){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Match Results Error: </span>[ remove " + error.error + "] " + error.reason + "</li>";
          //return false;
          return;
        }
        else {
          Meteor.call('tasks.insert', "matchtest", ws._id, vo.id
          , (err, res) => {
            if(err){
              //console.log(err);
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ matchtest " + err.error + "] " + err.reason + "</li>";
              //return false;
              return;
            }
            else {
              t.currentPage.set( "matchProcessComplete" );
            }
          });
        }
      });
    }
  },
  'click .back': function(){
    FlowRouter.go('/setup/match');
  },
  'click .preMatchModal' : function(e){
      e.preventDefault();
      var vertifyobjectid = Meteor.tools.getQueryParamByName("id");
      var ws = Session.get("currentWs");
      var matchresults = {id: 0};
      ModalHelper.openMatchConfirmModalFor(vertifyobjectid, matchresults.id);

      console.log("Match - prematchtest modal clicked");
  },
});

Template.matchProcessComplete.helpers({
  taskComplete: function(){
    //TODO: update this to use task, not existing results
    var ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne(id);
    complete = false;
    if(ws && vo){
      //var task = Tasks.findOne({"workspace_id": ws._id, "vertify_object_id": vo.id, "task": "matchtest"}});
      var mr = MatchResults.findOne({"workspace_id": ws._id, "vertify_object_id": vo.id});
      if(mr){
        complete = true;
      }
    }
    return complete;
  },
  match_results(){
    var ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    if(ws && id){
      var vo = VertifyObjects.findOne(id).name;
      //TODO: update this to use VO ID when match results are real
      return MatchResults.findOne({"workspace_id":ws._id});
    }
  },
  getExternalObjectNameById: function(id){
    //TODO:
    var ws = Session.get("currentWs");
    if(ws && id){
      console.log("external object id: " +  id);
      //TODO: update this to use workspace once match results are generated by Elixir
      var eo = ExternalObjects.findOne({ "id": id}); //, "workspace_id": ws._id }).name;
      var sys = Systems.findOne({id: eo.system_id});
      return sys.name + "-" + eo.name;
    }
    //TODO: throw error
    return "External Object Name";
  },
  getVertifyObjectNameById: function(id){
    var ws = Session.get("currentWs");
    if(ws && id){
      console.log("id: " + id + " | " + "ws: " + ws._id);
      return VertifyObjects.findOne({"id": id }).name;
    }
    //TODO: throw error
    return "Vertify Object Name";
  },
})

Template.matchProcessComplete.events({
  'click .returnToList' : function(e){
    console.log('Match - returnToList event clicked.');
    FlowRouter.go('/setup/match');
  },
  'click .viewMatchRecords' : function(e){
    console.log('Match - viewMatchRecords event clicked.');
    //FlowRouter.go('/setup/collect');
  },
  'click .editMatchRules' : function(e){
    console.log('Match - editMatchRules event clicked.');
    //FlowRouter.go('/setup/collect');
  },
  'click .acceptMatchModal' : function(e){
      e.preventDefault();
      var vertifyobjectid = Meteor.tools.getQueryParamByName("id");
      var ws = Session.get("currentWs");
      //TODO: this should use workspace, fix once match results are sent by Elixir
      var matchresults = MatchResults.findOne({"workspace_id":ws._id});//"workspace_id": ws._id});
      console.log("match Results:");
      console.log(matchresults);
      ModalHelper.openMatchConfirmModalFor(vertifyobjectid, matchresults.id);

      console.log("Match - complete match modal clicked");
  },
});
