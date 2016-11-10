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
    if(Session.get("connId"))
    {
      return true
    }
    return false;
  },
  connector() {
    if(Session.get("connId"))
    {
      var id = Session.get("connId");
      return Connectors.findOne({"id" : parseInt(id)});
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
