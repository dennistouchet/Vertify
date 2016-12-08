import { Template } from 'meteor/templating';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js'

import './fieldeditor.html';

Template.fieldeditor.onCreated(function(){
  Meteor.subscribe('vertify_properties', function (){
    console.log( "Align/FieldEditor - VertifyProperties now subscribed.");
  });
  // Get vertify object id from query parameters in url
  var vo_id = FlowRouter.getQueryParam("id");
  this.vo_id = new ReactiveVar(vo_id);
});

Template.fieldeditor.helpers({
  vertify_properties(){
    var ws = Session.get("currentWs");
    var vo_id = Template.instance().vo_id.get();
    if(ws && vo_id){
        return VertifyProperties.find({"workspace_id":ws._id, "vertify_object_id": vo_id});
    }
  }
});

Template.fieldeditor.events({
  'click .delete' : function(e){
    var errDiv = document.getElementById("addErrEditor");
    errDiv.innerHTML = ""; //reset errors

    Meteor.call('vertify_properties.remove'
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
      }
    });
  },
  'click .edit' : function(e){
    var errDiv = document.getElementById("addErrEditor");
    errDiv.innerHTML = ""; //reset errors

    console.log("edit called for: ", this._id);
  },
  'click .back' : function(e){
    var errDiv = document.getElementById("addErrEditor");
    errDiv.innerHTML = ""; //reset errors

    FlowRouter.go('/setup/align');
  }
});

Template.fieldDetails.helpers({

});

Template.fieldDetails.events({

});
