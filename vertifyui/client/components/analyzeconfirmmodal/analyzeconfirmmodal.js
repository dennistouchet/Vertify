import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../imports/collections/tenant/vertify_property.js';
import { AlignResults } from '../../../imports/collections/workspace/align_result.js';
import { Tasks } from '../../../imports/collections/global/task.js';

import './analyzeconfirmmodal.html';

Template.analyzeconfirmmodal.helpers({

});

Template.analyzeconfirmmodal.events({
  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("addErrModal");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    id = Session.get("analyzeVertifyObject");
    vo = VertifyObjects.findOne(id);

    ws = Session.get("currentWs");
    if(ws && vo){
      console.log("vertify object id:");
      console.log(vo);

    }
  },
});
