import { Template } from 'meteor/templating';
import { Workspaces } from '../../../../imports/collections/tenant/workspace.js';
import { Systems } from '../../../../imports/collections/tenant/system.js';
import { SystemInfos } from '../../../../imports/collections/global/system_info.js';

import './connect.html';

Template.connect.helpers({
  systems() {
    //determines if a workspace has been selected and added to session
    if(Session.get("currentWs")) {
      ws = Session.get("currentWs");
      if(ws.id) {
        Session.set("currentWsId", ws.id);
        console.log("Session currentWsId: " +  ws.id);
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
    if(Session.get("currentWsId")){
      return Session.get("currentWsId")
    }
    else{
      return null;
    }
  },
});

Template.connect.events({
  'click .delete' : function(){
      Meteor.call('systems.remove', this._id);
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
  'submit .new-system'(e){
    event.preventDefault(); //remove this once verification is setup to allow

    const target = e.target;
    const text = target.text.value;

    console.log('target text value:' + text );
    //Meteor.call('systems.insert', text, prefix, systemtype, username, password, maxconcurrenttasks);

    //target.text.value = '';
  },
  'click .add' : function(e) {
    e.preventDefault();

    //TODO: THIS CODE IS DUPLICATED IN SYSTEMADDMODAL.JS UNDER 'click ,add'
    //MAKE ANY NEW CHANGES THERE AS WELL
    //TODO:REFACTOR TO A SINGLE PLACE
    var name = document.getElementById("name");
    var pf = document.getElementById("pf");
    var st = document.getElementById("st");
    var un = document.getElementById("un");
    var pw = document.getElementById("pw");
    var maxtasks = document.getElementById("maxtasks");

    // Gets the element selected by the system name added. Used to get "data-id" value
    var text = document.getElementById("text");
    var selectedItem = document.getElementById(text.value.trim());

    if(! Session.get("currentWsId")){
      alert("No Workspace Selected");
    }
    else if( (name.value === "")){
      alert("Missing System value.");
    }
    else if ( (pf.value === "")){
      alert("Missing prefix value.");
    }
    else if ( (st.value === "")){
      alert("Missing system value.");
    }
    else if ( (un.value === "")){
      alert("Missing username value.");
    }
    else if ( (pw.value === "")){
      alert("Missing password value.");
    }
    else if ( (maxtasks.value === "")){
      alert("Missing maxconcurrenttasks value.");
    }
    else if (selectedItem == null){
      alert("Error: There is an issue with the selected system.");
    }
    else {
      var sysInfoId = selectedItem.getAttribute('data-value');
      var wsid = Session.get("currentWsId");

      //TODO: check if system values already exist (ie. name, prefix)
      console.log('name: ' + name.value  +' | ' + 'username: ' + un.value + ' | ' + 'system info id: ' +  sysInfoId);

      Meteor.call('systems.insert', wsid, sysInfoId, name.value.trim(), pf.value.trim()
      , st.value.trim(), un.value.trim(), pw.value.trim()
      , maxtasks.value.trim());
    }
  },
  'click .clear' : function() {
      document.getElementById("text").value = '';
      document.getElementById("name").value = '';
      document.getElementById("pf").value = '';
      document.getElementById("st").value = '';
      document.getElementById("un").value = '';
      document.getElementById("pw").value = '';
      document.getElementById("maxtasks").value = '';
  },
});

Template.connectSys.helpers({
  getConnectorName : function(id){
    if(Session.get("currentWs")){
      var conn = SystemInfos.findOne({"id" : id});
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

Meteor.subscribe('system_info', function(){
  console.log('Connect - SystemInfos now subscribed.');
});
