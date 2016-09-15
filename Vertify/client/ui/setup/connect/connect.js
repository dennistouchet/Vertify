import { Template } from 'meteor/templating';
import { Workspaces } from '../../../../imports/collections/tenant/workspace.js';
import { Systems } from '../../../../imports/collections/tenant/system.js';
import { Connectors } from '../../../../imports/collections/global/connectors.js';
import { Tasks } from '../../../../imports/collections/global/task.js';

import './connect.html';

Template.connect.helpers({
  systems() {
    //determines if a workspace has been selected and added to session
    if(Session.get("currentWs")) {
      ws = Session.get("currentWs");
      if(ws.id) {
        systemcount = Systems.find({"workspace_id": ws.id}).count();
        Session.set("systemCount", systemcount);
        console.log("Session SystemCount: " + Session.get("systemCount"));

        return Systems.find({"workspace_id": ws.id});
      }
      else{
        Session.set("systemCount", "0");
        console.log("Session SystemCount: " + Session.get("systemCount"));
        return Systems.find({});
      }
    }else {
      //TODO: should not show all systems
      Session.set("systemCount", "0");
      console.log("Session SystemCount: " + Session.get("systemCount"));
      return Systems.find({});
    }
  },
  hasWorkspace : function(){
    if(Session.get("currentWs")){
      return true;
    }
    else {
      return false;
    }
  },
  hasSystems : function(){
    if(Session.get("systemCount")){
      var sysCnt = parseInt(Session.get("systemCount"));
      if(sysCnt > 0){
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  hasEnoughSystems : function(){
    if(Session.get("systemCount")){
      var sysCnt = parseInt(Session.get("systemCount"));
      if(sysCnt > 1){
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  getWorkspaceId : function(){
    if(Session.get("currentWs")){
      var ws = Session.get("currentWs");
      return ws.id;
    }
    else{
      return null;
    }
  },
});

Template.connect.events({
  'click .delete' : function(){
    var errDiv = document.getElementById("addErrConnect");
    //reset errors
    errDiv.innerHTML = "";
    errDiv.style.display = "none";

    Meteor.call('systems.remove'
      , this._id
      , (err, res) => {
        if(err){
          //console.log(err);
          //TODO: improve with error Template
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
        }
        else {
          // successful call
          // return true;
        }
      });
  },
  'click .edit' : function(e){
      e.preventDefault();

      system = $(e.target).closest('.system');
      sysId = system.attr('data-id');

      ModalHelper.openSysEditModalFor(sysId);

      console.log("Connect - systems edit clicked for id: " + sysId );
  },
  'click .details' : function(e){
     $(e.target).find('i').toggleClass('glyphicon-chevron-up').toggleClass('glyphicon-chevron-down');
     console.log("Connect - systems details clicked");
  },
  'click .addModal' : function(e){
      e.preventDefault();

      ModalHelper.openSysAddModalFor();

      console.log("Connect - system addModal clicked")
  },
  'click .toCollect' : function(e){
    console.log('Connect - toCollect event clicked.');
    FlowRouter.go('/setup/collect');
  }
});

/*************************************

    Template:   connectSysZeroData

*************************************/

Template.connectSysZeroData.events({
  'click .sysinfoddl li a' : function(e, template){
    console.log("Object Event: " + e + " | Event Target: " + $(e.target));
    var btnprnt = $(e.target).parent().parent().parent();
    console.log("system ddl click event" + btnprnt[0] );

    var text = e.target.text;
    document.getElementById("text").value = text;
    document.getElementById("name").value = text;

  },
  'click .add' : function(e) {
    //TODO: THIS CODE IS DUPLICATED IN SYSTEMADDMODAL.JS UNDER 'click ,add'
    //MAKE ANY NEW CHANGES THERE AS WELL
    //TODO:REFACTOR TO A SINGLE PLACE
    e.preventDefault();
    var errDiv = document.getElementById("addErrConnect");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    var nm = document.getElementById("name");
    var pf = document.getElementById("pf");
    var maxtasks = document.getElementById("maxtasks");
    var settings = document.querySelectorAll('*[id^="setting_"]');

    // Gets the element selected by the system name added. Used to get "data-id" value
    var text = document.getElementById("text");
    var selectedItem = document.getElementById(text.value.trim());

    if(! Session.get("currentWs")){
      alert("No Workspace Selected");
    }
    else if( (nm.value === "")){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Missing Value:</span> Please enter a value for Name.</li>";
    }
    else if ( (pf.value === "")){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Missing Value:</span> Please enter a value for Prefix.</li>";
    }
    else if ( (maxtasks.value === "")){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Missing Value:</span> Please enter a value for Max Concurrent Tasks.</li>";
    }
    else if (selectedItem == null){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error:</span> Please selected a System from the list.</li>";
    }
    else {
      var sysInfoId = selectedItem.getAttribute('data-value');
      var ws = Session.get("currentWs");
      var nmexists = Systems.findOne({"name" : nm.value.trim()});
      var pfexists = Systems.findOne({"prefix" : pf.value.trim()});
      var setErr = 0;
      if (settings){
            for(i = 0; i < settings.length; i++){
              if(settings[i].value === ''){
                errDiv.style.display = 'block';
                errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error:</span> Missing Credential parameter: " + settings[i].name + ".</li>";
                setErr++;
              }
            }
      }
      var sets = [];
      for(i = 0; i < settings.length; i++){
        var set = {
          setting: settings[i].name,
          value: settings[i].value
        }
        console.log(set);
        sets.push(set);
      }

      if (nmexists) {
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error:</span>The system name already exists. Please use a different name</li>";
      }
      if (pfexists) {
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error:</span>The system prefix already exists. Please use a different prefix</li>";
      }
      if(nmexists == null && pfexists == null && setErr == 0){

        Meteor.call('systems.insert', ws.id, sysInfoId, nm.value.trim(), pf.value.trim()
          , maxtasks.value.trim(), sets
          , (err, res) => {
            if(err){
              //console.log(err);
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
              //return false;
            }
            else {
              Meteor.call('tasks.insert', "authenticate", wsid, res
              , (err, res) => {
                if(err){
                  //console.log(err);
                  errDiv.style.display = 'block';
                  errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
                  //return false;
                  return;
                }
                else {
                  // successful call
                  Meteor.call('tasks.insert', "discover", wsid, res
                  , (err, res) => {
                    if(err){
                      //console.log(err);
                      errDiv.style.display = 'block';
                      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
                      //return false;
                      return;
                    }
                    else {
                      // successful call

                      Modal.hide('systemaddmodal');
                    }
                  });
                }
              });
            }
          });
      }
      else {
        //TODO: show error
      }
    }
  },
  'click .clear' : function() {
      document.getElementById("text").value = '';
      document.getElementById("name").value = '';
      document.getElementById("pf").value = '';
      document.getElementById("maxtasks").value = '';
      errDiv = document.getElementById("addErrConnect");
      errDiv.style.display = 'none';
      errDiv.innerHTML = ""; //reset errors
  },
});

Template.connectSys.helpers({
  getConnectorName : function(id){
    if(Session.get("currentWs") && id){
      var conn = Connectors.findOne({"id" : id});

      return conn.name;
    }
    else {
      console.log("no workspace selected");
      return "DefaultSystem";
    }
  },
});

Meteor.subscribe('workspaces', function (){
  console.log( "Connect - Workspaces now subscribed.");
});

Meteor.subscribe('systems', function (){
  console.log( "Connect - Systems now subscribed.");
});

Meteor.subscribe('connectors', function(){
  console.log('Connect - Connectors now subscribed.');
});

Meteor.subscribe('tasks', function(){
  console.log('Connect - Tasks now subscribed');
})
