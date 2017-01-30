import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { Tasks } from '../../../imports/collections/global/task.js';

import './confirmmodal.html';

Template.confirmmodal.helpers({
  //SET UP SOME SORT OF GENERALIZED DATA CONTEXT
});

Template.confirmmodal.events({
  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("addErrModal");
    errDiv.style.display = 'none';
    errDiv.innerHtml = ''; //reset errors

    var id = FlowRouter.getQueryParam("id");
    var vo = VertifyObjects.findOne(id, {"workspace_id": ws._id});
    ws = Session.get('currentWs');
    if(ws && vo){
      //TODO

    }else{
    errDiv.style.display = 'block';
    errDiv.innerHTML = errDiv.innerHTML + '<li><span>Task Error: </span>[ Fix " + type + " unknown ] unrecognized task type</li>';
    }
  },
});
