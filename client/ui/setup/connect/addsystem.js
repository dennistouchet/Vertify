import { Template } from 'meteor/templating';
import { Connectors } from '../../../../imports/collections/global/connector.js';

import './connect.html';

Template.addsystem.onCreated(function(){
    Meteor.subscribe('connectors', function(){
      console.log('AddSystem - Connectors now subscribed.');

    });

    //Cleared selected Connector variable if page is reloaded
    delete Session.keys['connId'];
});

Template.addsystem.helpers({
  connectors(){
    return Connectors.find({});
  },
  connSelected : function(){
    var connid = Session.get("connId");
    if(connid)
    {
      return true
    }
    return false;
  },
  connector() {
    var connid = Session.get("connId");
    if(connid)
    {
      return Connectors.findOne(connid);
    }
  },
});

Template.addsystem.events({
  'click .sysinfoddl li a' : function(e, t){
    var conn = $(e.target)
    var id = conn.attr("data-value");
    console.log("data-value: " + id);
    if(id)
    {
      Session.set("connId", id);
    }
  },
});


Template.connSettings.helpers({
  isPrivate : function(name){
    if(name === 'password' || name === 'Password')
      return true;
  }
});

Template.connSettings.events({
  'mouseenter .view' : function(e, t){
    e.target.innerHTML = "Hide";
    var id = 'setting_' + e.target.id;
    var target = document.getElementById(id);
    target.type = "text";
  },
  'mouseleave .view' : function(e, t){
    e.target.innerHTML = "Show";
    var id = 'setting_' + e.target.id;
    var target = document.getElementById(id);
    target.type = "password";
  },
});
