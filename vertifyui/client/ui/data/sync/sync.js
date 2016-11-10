import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js';
import { Tasks } from '../../../../imports/collections/global/task.js'

import './sync.html';

Template.sync.helpers({
  vertify_objects(){
    var ws = Session.get("currentWs");
    if(ws){
      return VertifyObjects.find({"workspace_id": ws._id});
    }
    return VertifyObjects.find();
  },
});

Template.sync.events({

});
