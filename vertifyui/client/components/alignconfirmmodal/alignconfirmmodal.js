import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../imports/collections/tenant/vertify_property.js';
import { AlignResults } from '../../../imports/collections/workspace/align_result.js';
import { Tasks } from '../../../imports/collections/global/task.js';

import './alignconfirmmodal.html';

Template.alignconfirmmodal.helpers({
  align_results(){
    ws = Session.get("currentWs");
    ar = Session.get("selectedAlignResultId");
    if(ws && ar){
      console.log("AlignResult id:")
      console.log(ar);
      //TODO: add workspcaae when Exlisir generates align results
      return AlignResults.findOne({"id": ar}); //, "workspace_id": ws.id
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
    vo = VertifyObjects.findOne(id);

    ws = Session.get("currentWs");
    if(ws && vo){
      //TODO: reset vertify object ANALYZE status to disabled
      //TODO: delete all existing  vertify_properties for the vertify_object
      Meteor.call('vertify_objects.updateStatus', ws.id, vo.id, 'analyze', false
      , (err, res) => {
        if(err){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Vertify Object " + err.error + "] " + err.reason + "</li>";
          //return false;
          return;
        }else {
          console.log("Align Update VO Status success");
          Meteor.call('vertify_properties.removeMultiple', ws.id, vo.id
          , (err, result)   => {
            if(err){
              //console.log(err);
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Vertify Property Remove " + err.error + "] " + err.reason + "</li>";
              //return false;
              return;
            }else {
              console.log("Align Remove VProperties success");
              Meteor.call('vertify_properties.insertMultiple', ws.id, vo.id
              , (err, res) => {
                if(err){
                  //console.log(err);
                  errDiv.style.display = 'block';
                  errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Vertify Property " + err.error + "] " + err.reason + "</li>";
                  //return false;
                  return;
                }else {
                  console.log("Align Insert Multiple VProperties success");
                  Meteor.call('tasks.insert', "align", ws.id, vo.id
                  , (error, result) => {
                    if(error){
                      //console.log(err);
                      errDiv.style.display = 'block';
                      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ Align " + error.error + "] " + error.reason + "</li>";
                      //return false;
                      return;
                    }
                    else {
                    console.log("Align Task success");
                     //success
                     Meteor.tools.updateAlignStatus(ws.id, vo.id, 'align', true);
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
  console.log( "Match - ExternalObjects now subscribed.");
});

Meteor.subscribe('vertify_objects', function (){
  console.log( "Align - VertifyObjects now subscribed.");
});

Meteor.subscribe('vertify_properties', function (){
  console.log( "Align - VertifyProperties now subscribed.");
});

Meteor.subscribe("align_result", function (){
  console.log( "Aligncomfirmmodal - AlignResults now subscribed.");
});

Meteor.subscribe("tasks", function (){
  console.log( "Aligncomfirmmodal - Tasks now subscribed.");
});
