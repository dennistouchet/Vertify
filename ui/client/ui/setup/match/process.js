import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { MatchResults } from '../../../../imports/collections/workspace/match_result.js';

import './process.html';

Template.process.onCreated(function(){
  this.currentPage = new ReactiveVar("processZeroData"); //other is matchProcessComplete
});

Template.process.helpers({
  mwizard() {
    return Template.instance().currentPage.get();
  },
  properties(){
    //TODO: get vertify object properties
    return false;
  },
  queryParams(){
    console.log("process queryParams:");
    console.log(queryParams.id);
  },
  workspaceChanged: function(){
    var url = window.location.href;
    var res = url.split("?");
    window.history.pushState(null,"", "setup/match");
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
    ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne({"_id": id});

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
    if(ws){
      return MatchResults.findOne({});
    }
  },
  getMatched : function(){
    //TODO: get value from match results
    return 100;
  },
  getTotal : function(){
    //TODO: get value from system of truth total
    return 125000;
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
