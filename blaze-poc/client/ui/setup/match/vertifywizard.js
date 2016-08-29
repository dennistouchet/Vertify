import { Template } from 'meteor/templating';
import { Workspaces } from '../../../../imports/collections/tenant/workspace.js';
import { Systems } from '../../../../imports/collections/tenant/system.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { MatchSetup } from '../../../../imports/collections/tenant/match_setup.js';

Template.vertifywizard.onCreated( function() {
  delete Session.keys['setupId'];
  var ws = Session.get("currentWs");
  if(ws == null){
    return false;
  }
  // Set to Select step for workspaces with no Vertify Objects
  var count = VertifyObjects.find({"workspace_id": ws.id}).count();
  if(count > 0)
  {
    this.currentTab = new ReactiveVar("vwStart");
  }
  else{
    this.currentTab = new ReactiveVar("vwStart");
    //TODO change this and set "active" class
    //this.currentTab = new ReactiveVar("vwSelect");
  }
});

Template.vertifywizard.helpers({
  vwizard : function() {
    return Template.instance().currentTab.get();
  },
  vwizardData : function() {
    var tab = Template.instance().currentTab.get();

    var data = {
      "vwStart": [],
      "vwSelect":[],
      "vwRecords":[],
      "vwMatch":[],
      "vwFinish":[]
    }

    return data[tab];
  },
  isActive : function(tab){
    var currentTab = Template.instance().currentTab.get();
    if(tab == currentTab){
      return true;
    }
    return false;
  }
});

Template.vertifywizard.events({
  'click .nav-pills li' : function(e,t){
    var currentTab = $(e.target).closest("li");

    currentTab.addClass("active");
    $(".nav-pills li").not( currentTab ).removeClass("active");

    console.log("Selected Dynamic Template: " + currentTab.data("template"));
    t.currentTab.set( currentTab.data("template") );
  },
  'click .next' : function(e,t){
    var ws = Session.get("currentWs");
    var steps = [ 'vwStart', 'vwSelect', 'vwFilter', 'vwMatch', 'vwFinish' ];
    var tab = Template.instance().currentTab.get();
    var index = null;
    for(i = 0; i < steps.length; i++){
      //console.log("for loop - index: " + i + " | step: " + steps[i] + " | " + "tab : " + tab);
      if(steps[i] === tab){
        index = i + 1;
      }
    }

    if( index >= steps.length){
      console.log( "Next clicked" );
      console.log("move to finish");
          if(Session.get("setupId")){
            Meteor.call('match_setup.finishedit', Session.get("setupId"), ws.id, steps[index -1] );
          }
      //TODO: clear Session("setupId");
      FlowRouter.go('/setup/match');
    }
    else{
      msId = Session.get("setupId");
      switch(index){
        case 1: console.log("move to select");
                if(msId){
                  Meteor.call('match_setup.startedit', msId, ws.id, steps[index -1], false);
                }else{
                  var newid = Meteor.call('match_setup.insert', ws.id, steps[index -1], true
                  , (err, res) => {
                    if(err){
                      //console.log(err);
                      //TODO: improve with error Template
                      errDiv.style.display = 'block';
                      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
                    }
                    else{
                      console.log("res: " + res);
                      Session.set("setupId", res);
                      newid = res;
                      console.log("newid inside call: " + newid);
                    }
                  });
                }
                // NOTE: Meteor call is asynchronous and values from the call may not be present here (ex. newid)
                // use caution when editing any values after this Meteor.call
                break;
        case 2: console.log("move to filter");
                if(msId){
                  Meteor.call('match_setup.selectedit', msId, ws.id, steps[index -1] );
                }
                break;
        case 3: console.log("move to match");
                if(msId){
                  Meteor.call('match_setup.filteredit', Session.get("setupId"), ws.id, steps[index -1] );
                }
                break;
        case 4: console.log("move to finish");
                if(msId){
                  Meteor.call('match_setup.matchedit', msId, ws.id, steps[index -1] );
                }
                break;
        default:console.log("defaulted");
      }
      t.currentTab.set( steps[index] );

      var tabs = $(".nav-pills li");
      tabs.removeClass("active");

      var currentTab = $("ul").find("[data-template='" + steps[index] + "']");
      currentTab.addClass("active");
      //TODO: SET NEXT BUTTON TEXT TO FINISH
    }
  },
  'click .back' : function(e,t){
    var steps = [ 'vwStart', 'vwSelect', 'vwFilter', 'vwMatch', 'vwFinish' ];
    var tab = Template.instance().currentTab.get();
    var index = null;
    for(i = 0; i < steps.length; i++){
      if(steps[i] === tab){
        index = i - 1;
      }
    }
    if( index < 0){
      console.log( "Back clicked" );
      FlowRouter.go('/setup/match');
    }
    else{
      switch(index){
        case 0: console.log("move to start");
                break;
        case 1: console.log("move to select");
                break;
        case 2: console.log("move to filter");
                break;
        case 3: console.log("move to match");
                break;
        default:console.log("defaulted");
      }

      t.currentTab.set( steps[index] );

      var tabs = $(".nav-pills li");
      tabs.removeClass("active");

      var currentTab = $("ul").find("[data-template='" + steps[index] + "']");
      currentTab.addClass("active");
    }
    //TODO: SET BACK BUTTON TEXT TO CANCEL
  },
});

Template.vwStart.helpers({
    vertify_objects(){
      var ws = Session.get("currentWs");
      if(ws){
        return VertifyObjects.find({"workspace_id": ws.id});
      }
      return null
    }
});

Template.vwStart.events({
  'change .radio' : function(e, t){
    var radio = e.target;
    var input = document.getElementById("objtext");
    var ddl = document.getElementById("objddlbtn");

    if(radio.value == "exist"){
      input.disabled = false;
      ddl.disabled = false;
    }
    else{
      input.disabled = true;
      ddl.disabled = true;
    }
  }
});

Template.vwSelect.helpers({
    external_objects(){
      var ws = Session.get("currentWs");
      if(ws){
        return ExternalObjects.find({"workspace_id": ws.id});
      }
      return null
    }
});

Template.vwSelect.events({
  'click .objddl1 li a' : function(e, t){
    var text = e.target.text;
    document.getElementById("extobj1").value = text.toString().trim();
    var msId = e.target.getAttribute("data-id");
    console.log("msid: " + msId);
  },
  'click .objddl2 li a' : function(e, t){
    var text = e.target.text;
    document.getElementById("extobj2").value = text.toString().trim();
    var msId = e.target.getAttribute("data-id");
    console.log("msid: " + msId);
  },
});

Template.vwFilter.helpers({
  selectExternalObjects(){

  },
});
