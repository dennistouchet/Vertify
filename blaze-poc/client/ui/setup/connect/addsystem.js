import { Template } from 'meteor/templating';
import { Connectors } from '../../../../imports/collections/global/connectors.js';

import './connect.html';

Template.addsystem.onCreated(function(){
  //Cleared selected Connector variable if page is reloaded
  console.log("AddSystem - delete Session connId");
  delete Session.keys['connId'];
});

Template.addsystem.helpers({
  connectors(){
    console.log("inside addsystem connector");
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
      var selConn = Connectors.findOne({"id" : id});
      return Connectors.findOne({"id" : id});
    }
  },
});

Template.addsystem.events({
  'click .sysinfoddl li a' : function(e, t){
    var conn = $(e.target)
    var id = conn.attr("data-value");
    console.log(id);
    if(id)
    {
      Session.set("connId", id);
    }
  },
})

Meteor.subscribe('connectors', function(){
  console.log('AddSystem - Connectors now subscribed.');
});
