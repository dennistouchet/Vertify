import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js'

import './process.html';

Template.alignprocess.helpers({
  properties(){
    //TODO:
    return null;
  },
  vertify_object(){
    //TODO:
    return "VertifyLeadNs";
  },
  hasObjects(){
    //TODO:
    return false;
  },
  hasProperties(){
    //TODO:
    return false;
  }
});


Template.alignprocess.events({
  'click' : function(){
    console.log("alignprocess click event");
    //ModalHelper.openAlignConfirmModalFor(sysId);
  },
  'change input': function(e, t){
    //TODO: change this event so it only happens on the radio buttons and not other inputs
    console.log(e.target);
    var el = e.target.value;

    if(el === "criteria"){
      console.log("show filter");
      document.getElementById(("filterCriteria")).style.display = "inline";
    }
    else if(el === "count"){
      document.getElementById(("filterCriteria")).style.display = "none";
    }
  },
  'click .align' : function(e, t){
    console.log('Align Process - align event clicked.');
    var errDiv = document.getElementById("addErrAlign");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    ws = Session.get("currentWs");
    var id = Meteor.tools.getQueryParamByName("id");
    var vo = VertifyObjects.findOne({"_id": id});

    if(ws && vo){
      Meteor.call('tasks.insert', "aligntest", ws.id, vo.id
      , (error, result) => {
        if(error){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ aligntest " + error.error + "] " + error.reason + "</li>";
          //return false;
          return;
        }
        else {
          t.currentPage.set( "alignProcessComplete" );
        }
      });
    }
  },
});
