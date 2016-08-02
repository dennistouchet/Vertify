import { Template } from 'meteor/templating';
import { Workspaces } from '../../../imports/collections/tenant/workspace.js';
import './workspaces.html';

Template.workspaces.helpers({
  workspaces() {
    return Workspaces.find({});
  },
});

Template.workspaces.events({
  'submit .new-workspace'(e){
    e.preventDefault();

    const target = e.target;
    const text = target.text.value;

    Meteor.call('workspaces.insert', text);

    target.text.value = '';
  },
  'click .add' : function(e) {
      var target = document.getElementById("text");
      if(! (target.value === ""))
      {
          Meteor.call('workspaces.insert', target.value);
      }
      // When WS is added, set new WS to current  and redirect to Setup Page
      var ws = Workspaces.findOne({"name": target.value});
      Session.set("currentWs", ws);
      FlowRouter.go('/setup');

      target.value = '';
  },
  'click .clear' : function() {
      document.getElementById("text").value = '';
  },
  'click .delete' : function(){
      Meteor.call('workspaces.remove', this._id);
  },
  'click .edit' : function(e){
    e.preventDefault();

    workspace = $(e.target).closest('.workspace');
    wsId = workspace.attr('data-id');

    ModalHelper.openWsEditModalFor(wsId);

    console.log("workspaces edit clicked for id: " + wsId );
  },
  'click .addModal' : function(e){
    e.preventDefault();

    ModalHelper.openWsAddModalFor();

    console.log('workspaces add modal clicked.')
  },
});

Meteor.subscribe('workspaces', function (){
  console.log( "Workspaces - Workspaces data ready");
});
