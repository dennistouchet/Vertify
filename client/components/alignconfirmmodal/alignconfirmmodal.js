import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { AlignResults } from '../../../imports/collections/workspace/align_result.js';
import { Tasks } from '../../../imports/collections/global/task.js';

import './alignconfirmmodal.html';

Template.alignconfirmmodal.onCreated(function(){
  Meteor.subscribe('vertify_objects', function (){
    console.log( "Aligncomfirmmodal - VertifyObjects now subscribed.");
  });
  Meteor.subscribe("align_result", function (){
    console.log( "Aligncomfirmmodal - AlignResults now subscribed.");
  });
  Meteor.subscribe("tasks", function (){
    console.log( "Aligncomfirmmodal - Tasks now subscribed.");
  });
})

Template.alignconfirmmodal.helpers({
  align_results(){
    ws = Session.get("currentWs");
    vo_id = Meteor.tools.getQueryParamByName("id");
    vo = VertifyObjects.findOne(vo_id);
    if(ws && vo){
      return AlignResults.findOne({"workspace_id": ws._id, "vertify_object_id": vo._id});
    }
  },
  approvedPropertyCount(id){
    var AR = AlignResults.findOne(id);
    let count = 0;
    if(AR){
      AR.alignment_properties.forEach( field => {
        if(field.approved)
          count += 1;
      });
    }
    return count;
  }
});

Template.alignconfirmmodal.events({
  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("addErrModal");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    id = Session.get("selectedVertifyObject");
    console.log("Selected Vertify Object Id: " + id);
    vo = VertifyObjects.findOne(id);

    ws = Session.get("currentWs");
    tnt = Session.get("currentTnt");
    if(tnt && ws && vo){
      Meteor.call('vertify_objects.updateStatus', ws._id, vo._id, 'analyze', false
      , (err, res) => {
        if(err){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Vertify Object " + err.error + "] " + err.reason + "</li>";
          //return false;
          return;
        }else {
          //console.log("Align Update VO Status success");
          Meteor.call('vertify_properties.removeMultiple', ws._id, vo._id
          , (error, result)   => {
            if(err){
              //console.log(err);
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Vertify Property Remove " + error.error + "] " + error.reason + "</li>";
              //return false;
              return;
            }else {
              //console.log("Align Remove Vertify Properties success");
              //console.log("Calling Meteor.VP.insert multuple. WS: " + ws._id + " | vo: " + vo._id);
              Meteor.call('vertify_properties.insertMultiple', tnt._id, ws._id, vo._id
              , (err, res) => {
                if(err){
                  console.log(err);
                  errDiv.style.display = 'block';
                  errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Vertify Property " + err.error + "] " + err.reason + "</li>";
                  //return false;
                  return;
                }else {
                  //console.log("Align Insert Multiple Vertify Properties success");
                  Meteor.call('tasks.insert', "align", ws._id, vo._id
                  , (error, result) => {
                    if(error){
                      console.log(err);
                      errDiv.style.display = 'block';
                      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ Align " + error.error + "] " + error.reason + "</li>";
                      //return false;
                      return;
                    }
                    else {
                     console.log("Align Task success");
                     //success
                     Meteor.tools.updateVertifyObjectStatus(ws._id, vo._id, 'align', true);
                     FlowRouter.go('/setup/align');
                     Modal.hide('alignconfirmmodal');
                   }
                  });
                }
              });
            }
          });
        }
      });
    }
    else{
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>ERROR: </span>[ Missing Value ] Could not find TNT: " + tnt + " | WS: " + ws + " | or VO: " + vo +"</li>";
      return;
    }
  },
});
