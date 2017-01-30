import { Template } from 'meteor/templating';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js'
import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js'
import { Systems } from '../../../../imports/collections/tenant/system.js'
import './fieldeditor.html';

Template.fieldeditor.onCreated(function(){
  Meteor.subscribe('vertify_properties', function (){
    console.log( "Align/FieldEditor - VertifyProperties now subscribed.");
  });
  Meteor.subscribe('external_objects', function (){
    console.log( "Align/FieldEditor - ExternalObjects now subscribed.");
  });
  Meteor.subscribe('systems', function (){
    console.log( "Align/FieldEditor - Systems now subscribed.");
  });
  // Get vertify object id from query parameters in url
  var vo_id = FlowRouter.getQueryParam("id");
  this.vo_id = new ReactiveVar(vo_id);
});

Template.fieldeditor.helpers({
  vertify_properties(){
    var ws = Session.get('currentWs');
    var vo_id = Template.instance().vo_id.get();
    if(ws && vo_id){
        return VertifyProperties.find({"workspace_id":ws._id, "vertify_object_id": vo_id});
    }
  }
});

Template.fieldeditor.events({
  'click .delete' : function(e){
    var errDiv = document.getElementById("addErrEditor");
    errDiv.innerHtml = ''; //reset errors

    Meteor.call('vertify_properties.remove'
    , this._id
    , (err, res) => {
      if(err){
        //console.log(err);
        //TODO: improve with error Template
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[' + err.error + '] ' + err.reason + '</li>';
      }
      else {
        // successful call
      }
    });
  },
  'click .edit' : function(e){
    var errDiv = document.getElementById("addErrEditor");
    errDiv.innerHtml = ''; //reset errors

    console.log("edit called for: ", this._id);
  },
  'click .back' : function(e){
    var errDiv = document.getElementById("addErrEditor");
    errDiv.innerHtml = ''; //reset errors

    FlowRouter.go('/setup/align');
  }
});

Template.fieldeditorproperties.helpers({
  getFullNameByEOId : function(eo_id){
    var ws = Session.get('currentWs');
    var eo = ExternalObjects.findOne(eo_id);
    let fullname = "";
    if(eo){
        var sys = Systems.findOne(eo.system_id);
        if(sys)
          fullname = sys.name +"-"+ eo.name;
    }
    return fullname;
  },
})

Template.fieldeditorfield.helpers({
  getFullNameByEOId : function(eo_id){
    var ws = Session.get('currentWs');
    var eo = ExternalObjects.findOne(eo_id);
    let fullname = "";
    if(eo){
        var sys = Systems.findOne(eo.system_id);
        if(sys)
          fullname = sys.name +"-"+ eo.name;
    }
    return fullname;
  },
});

Template.fieldeditorfield.events({
  'change input' : function(e, t){
    console.log('Field Editor - input changed.');
    var errDiv = document.getElementById("addErrEditor");
    errDiv.style.display = 'none';
    errDiv.innerHtml = ''; //reset errors

    let eo_id = e.target.name.substring(9);
    console.log("VProperty Id: ", this._id);
  },
  'click .cancel' : function(e){
    console.log('Field Editor - cancel clicked.');
    var errDiv = document.getElementById("addErrEditor");
    errDiv.style.display = 'none';
    errDiv.innerHtml = ''; //reset errors
  },
  'click .save' : function(e){
    console.log('Field Editor - save clicked.');
    var errDiv = document.getElementById("addErrEditor");
    errDiv.style.display = 'none';
    errDiv.innerHtml = ''; //reset errors
    //validate inputs
    errDiv.style.display = 'block';
    errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[ Action Unavailable ] Vertify Property editing is not currently enabled. </li>';

    console.log("ID:" + this._id);
    /*
    Meteor.call('vertify_properties.updateSingle', ws._id, vp._id
    , (error, results) => {
      if(error){
        //console.log(err);
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + '<li><span>Field Edit Error: </span>[ updateSingle ' + error.error + '] ' + error.reason + '</li>';
      }
      else{
        //success;
      }
    });*/
  }
});
