import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../imports/collections/tenant/vertify_property.js';
import { AlignResults } from '../../../imports/collections/workspace/align_result.js';
import { Tasks } from '../../../imports/collections/global/task.js';

import './alignconfirmmodal.html';

Template.alignconfirmmodal.helpers({
  align_results(){
    ws = Session.get("currentWs");
    if(ws){
      return AlignResults.findOne({"workspace_id": ws._id});
    }
  },
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
    if(ws && vo){
      Meteor.call('vertify_objects.updateStatus', ws._id, vo.id, 'analyze', false
      , (err, res) => {
        if(err){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Vertify Object " + err.error + "] " + err.reason + "</li>";
          //return false;
          return;
        }else {
          //console.log("Align Update VO Status success");
          Meteor.call('vertify_properties.removeMultiple', ws._id, vo.id
          , (error, result)   => {
            if(err){
              //console.log(err);
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Vertify Property Remove " + error.error + "] " + error.reason + "</li>";
              //return false;
              return;
            }else {
              //console.log("Align Remove Vertify Properties success");
              //console.log("Calling Meteor.VP.insert multuple. WS: " + ws._id + " | vo: " + vo.id);
              Meteor.call('vertify_properties.insertMultiple', ws._id, vo.id
              , (err, res) => {
                if(err){
                  console.log(err);
                  errDiv.style.display = 'block';
                  errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Vertify Property " + err.error + "] " + err.reason + "</li>";
                  //return false;
                  return;
                }else {
                  //console.log("Align Insert Multiple Vertify Properties success");
                  Meteor.call('tasks.insert', "align", ws._id, vo.id
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
                     Meteor.tools.updateAlignStatus(ws._id, vo.id, 'align', true);
                    //TODO update vertify object align status
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
  },
});

Meteor.subscribe('external_objects', function (){
  console.log( "Aligncomfirmmodal - ExternalObjects now subscribed.");
});

Meteor.subscribe('vertify_objects', function (){
  console.log( "Aligncomfirmmodal - VertifyObjects now subscribed.");
});

Meteor.subscribe('vertify_properties', function (){
  console.log( "Aligncomfirmmodal - VertifyProperties now subscribed.");
});

Meteor.subscribe("align_result", function (){
  console.log( "Aligncomfirmmodal - AlignResults now subscribed.");
});

Meteor.subscribe("tasks", function (){
  console.log( "Aligncomfirmmodal - Tasks now subscribed.");
});
