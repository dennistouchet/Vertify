import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js'

import './fieldeditor.html';

Template.fieldeditor.helpers({
  vertify_properties(){
    var ws = Session.get("currentWs");
    var id = FlowRouter.getQueryParam("id");
    console.log("Param Id: "+ id);
    if(ws){
        return VertifyProperties.find({"workspace_id":ws._id});
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
  'click .back' : function(e){
    var errDiv = document.getElementById("addErrEditor");
    errDiv.innerHTML = ""; //reset errors

    FlowRouter.go('/setup/align');
  }
});
