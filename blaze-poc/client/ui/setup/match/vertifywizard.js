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
  },
  moveNext : function(){
    //TODO: pausing template change while waiting for meteor response
    //display loading on click
    //setup flag to false
    //meteor call
    //set flag to true
    var moveFlag = false;
    if(moveFlag){
      //todo
    }else{
      //todo
    }
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
    var errDiv = document.getElementById("addErrMatch");
    errDiv.innerHTML = "";
    errDiv.style.display = "none"; //reset errors

    for(i = 0; i < steps.length; i++){
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
        case 1: console.log("start next clicked - moving to select");
                var isnew = document.getElementById("radionew").checked;
                if(msId){
                  Meteor.call('match_setup.startedit', msId, ws.id, steps[index -1], isnew
                  , (err, res) => {
                    if(err){
                      //console.log(err);
                      //TODO: improve with error Template
                      errDiv.style.display = 'block';
                      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
                      return;
                    }
                    else{
                      console.log("successful edit/update");
                    }
                  });
                }else{
                  var newid = Meteor.call('match_setup.insert', ws.id, steps[index -1], isnew
                  , (err, res) => {
                    if(err){
                      //console.log(err);
                      //TODO: improve with error Template
                      errDiv.style.display = 'block';
                      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
                      return;
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
        case 2: console.log("select next clicked - moving to filter");
                if(msId){
                  currentMs = MatchSetup.findOne({"id": parseInt(msId), "workspace_id": ws.id });
                  console.log(currentMs);
                  if(currentMs){
                    if(currentMs.new_object){
                      var extobj1 = parseInt(document.getElementById("extobj1").getAttribute("data-id"));
                      var extobj2 = parseInt(document.getElementById("extobj2").getAttribute("data-id"));
                      console.log("extobj1: " + extobj1 + "| extobj2: " + extobj2);

                      if(extobj1 && extobj2){
                        if(extobj1 == extobj2){
                          errDiv.style.display = 'block';
                          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span> Selected values are the same.</li>";
                          return;
                        }
                        var extobjids = [extobj1, extobj2];
                        Meteor.call('match_setup.selectedit', msId, ws.id, steps[index -1], extobjids
                        , (err, res) => {
                          if(err){
                            //console.log(err);
                            //TODO: improve with error Template
                            errDiv.style.display = 'block';
                            errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
                            return;
                          }
                          else{
                            console.log("successful edit/update");
                          }
                        });
                      }
                      else{
                        errDiv.style.display = 'block';
                        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span> Missing Values. </li>";
                        return;
                      }
                    }else{
                      //TODO: existing object logic
                      //check that value 1 exists
                      //check that value 1 isn't already on the lists
                      console.log("Existing Object Logic called");
                      errDiv.style.display = 'block';
                      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span> Existing Objects are not currently supported. Please go back and select new object creation.</li>";
                      return;
                    }
                  }
                }
                break;
        case 3: console.log("filter next clicked - moving to match");
                if(msId){

                  var radioalls = document.getElementsByClassName("radioall");
                  console.log(radioalls);
                  allRecords1 = radioalls[0].checked;
                  allRecords2 = radioalls[1].checked;

                  var output = Meteor.call('match_setup.filteredit'
                    , Session.get("setupId"), ws.id, steps[index -1], allRecords1, allRecords2, null, null
                    , (err, res) => {
                      if(err){
                        //console.log(err);
                        //TODO: improve with error Template
                        errDiv.style.display = 'block';
                        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
                        return;
                      }
                      else{
                        console.log("successful edit/update");
                      }
                    });
                }
                break;
        case 4: console.log("match next clicked - moving to finish");
                if(msId){

                match_criteria = [{
                  field1: "Email",
                  match_percentage: 100,
                  field2: "email"
                }];

                  Meteor.call('match_setup.matchedit', msId, ws.id, steps[index -1], match_criteria );
                }
                break;
        case 5: console.log("finish next clicked - exit wizard");
                if(msId){

                match_criteria = [{
                  field1: "Email",
                  match_percentage: 100,
                  field2: "email"
                }];

                  Meteor.call('match_setup.finishedit', msId, ws.id, steps[index -1] );
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
    var eoId = $(e.target).closest('li').data("id");
    document.getElementById("extobj1").setAttribute("data-id", eoId);
    console.log("eoId: " + eoId);

  },
  'click .objddl2 li a' : function(e, t){
    var text = e.target.text;
    document.getElementById("extobj2").value = text.toString().trim();
    var eoId = $(e.target).closest('li').data("id");
    document.getElementById("extobj2").setAttribute("data-id", eoId);
    console.log("eoId: " + eoId);


    //TODO: remove element from other dropdownlist
    //var element document.getElementById((eoid + "obj1"));
    //element.parentNode.removeChild(element);
  },
});

Template.vwFilter.helpers({
  selectExternalObjects(){

  },
  external_objects(){
    var ws = Session.get("currentWs");
    var msId = Session.get("setupId")
    if(ws && msId){
      var msObj = MatchSetup.findOne({"id": msId, "workspace_id": ws.id});
      console.log(msObj);
      var ids = msObj.eo_ids;
      console.log(msObj.eo_ids);
      return ExternalObjects.find({"id": { $in: ids }});
    }else{
      return null;
    }
  }
});

Template.filterRecords.events({
  'change input': function(e, t){
    //TODO: change this event so it only happens on the radio buttons and not other inputs
    console.log(e.target);
    var el = e.target.value;
    var id = e.target.getAttribute("data-id");

    if(el === "recordFilter"){
      console.log("show filter");
      document.getElementById(("filterCriteria" + id)).style.display = "inline";
    }
    else if(el === "recordAll"){
      document.getElementById(("filterCriteria" + id)).style.display = "none";
    }
  },
  'click .objddl li a' : function(e, t){
    var text = e.target.text;
    var id = e.target.parentNode.parentNode.parentNode.getAttribute("data-id");
    document.getElementById(("extobjprop"+id)).value = text.toString().trim();
    var eopId = e.target.parentNode.getAttribute("data-id");
    document.getElementById(("extobjprop"+id)).setAttribute("data-id", eopId);
    console.log("eopId: " + eopId);
  },
});

Template.vwMatch.helpers({

  external_objects(){
    var ws = Session.get("currentWs");
    var msId = Session.get("setupId")
    if(ws && msId){
      var msObj = MatchSetup.findOne({"id": msId, "workspace_id": ws.id});
      console.log(msObj);
      var ids = msObj.eo_ids;
      console.log(msObj.eo_ids);
      return ExternalObjects.find({"id": { $in: ids }});
    }else{
      return null;
    }
  },
});

Meteor.subscribe('external_objects', function (){
  console.log( "Match Wizard - ExternalObjects now subscribed.");
});

Meteor.subscribe('match_setup', function (){
  console.log( "Match Wizard - MatchSetup now subscribed.");
});
