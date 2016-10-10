import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { MatchResults } from '../../../../imports/collections/workspace/match_result.js';

import './process.html';

Template.process.onCreated(function(){
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
      Meteor.call('tasks.insert', "matchtest", ws.id, vo.id
      , (error, result) => {
        if(error){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ matchtest " + error.error + "] " + error.reason + "</li>";
          //return false;
          return;
        }
        else {
          t.currentPage.set( "matchProcessComplete" );
        }
      });
    }
  },
});

Template.matchProcessComplete.helpers({
  match_results(){
    var ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    if(ws && id){
      var vo = VertifyObjects.findOne(id).name;
      //TODO: update this to use VO ID when match results are real
      return MatchResults.findOne({"workspace_id": ws.id});
    }
    return MatchResults.findOne({});
  },
  vertify_object(){
    //TODO: fix this. It tries to get the ID before the template is rendered and the queryparams are set so it fails
    var ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    if(ws && id){
      return VertifyObjects.findOne(id).name;
    }
    return null;
  },
  getExternalObjectName: function(id){
    //TODO:
    return "External Object Name";
  },
  getVertifyObjectName: function(id){
    //TODO:
    return "Vertify Object Name";
  }
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
      var matchresults = MatchResults.findOne({"workspace_id": ws.id});
      console.log("match Results:");
      console.log(matchresults);
      ModalHelper.openMatchConfirmModalFor(vertifyobjectid, matchresults.id);

      console.log("Match - complete match modal clicked");
  },
});

Meteor.subscribe('vertify_objects', function (){
  console.log( "Match/Process - VertifyObjects now subscribed." );
});

Meteor.subscribe('match_results', function (){
  console.log( "Match/Process - MatchResults now subscribed." );
});
