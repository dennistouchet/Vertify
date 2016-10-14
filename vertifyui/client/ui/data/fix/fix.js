import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './fix.html';

Template.fix.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      //TODO: add precision for approved
      return VertifyObjects.find({"workspace_id": ws.id});
    }
    return VertifyObjects.find();
  },
});

Template.fix.events({

});
