import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js'

import './fieldeditor.html';

Template.fieldeditor.helpers({
  vertify_properties(){
    var ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    console.log("Param Id: "+ id);
    if(ws){
        return VertifyProperties.find({"workspace_id":ws.id});
    }
  }
});

Template.fieldeditor.events({

});
