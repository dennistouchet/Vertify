import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './fix.html';

Template.fix.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      var vo = VertifyObjects.find({"workspace_id": ws.id});
      console.log("vertify_object: ");
      console.log(vo);
      return vo;
    }
    return null;
  },
  complete: function(){
    var ws = Session.get("currentWs");
    var complete = false;
    if(ws){
      return complete;
    }
  },
});

Template.fix.events({

});

Template.fixVertifyObjects.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      var vo = VertifyObjects.find({"workspace_id": ws.id});
      console.log("vertify_object: ");
      console.log(vo);
      return vo;
    }
    return null;
  },
});

Template.fixVertifyObjectli.helpers({
  getRecordCount : function(id){
    var ws = Session.get("currentWs");
    var vo = VertifyObjects.findOne({"id": parseInt(id), "workspace_id": ws.id});

    vo.external_objects.forEach(function(eo){
      if(eo.is_truth){
        return eo.record_count;
      }
    });
    return 0;
  },
});
