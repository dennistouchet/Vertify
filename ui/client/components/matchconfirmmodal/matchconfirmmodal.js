import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../imports/collections/tenant/vertify_object.js';
import { Tasks } from '../../../imports/collections/global/task.js';

Template.matchconfirmmodal.helpers({
  vertify_objects(){
    ws = Session.get("currentWs");
    console.log(Session.get("selectedVertifyObject"))
    if(ws){

      return VertifyObjects.findOne({"workspace_id": ws.id})
    }
  }
});

Template.matchconfirmmodal.events({
  'click #save': function(e) {
    e.preventDefault();
    //todo: get id from url
    ws = Session.get("currentWs");
    if(ws){
      Meteor.call('tasks.insert', "match", ws.id, res
      , (error, result) => {
        if(error){
          //console.log(err);
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Task Error: </span>[ Match " + error.error + "] " + error.reason + "</li>";
          //return false;
          return;
        }
        else {
         //success
        }
      });
    }
  },
});

Meteor.subscribe("match_results", function (){
  console.log( "Matchconfirmmodal - MatchResults now subscribed.");
});


Meteor.subscribe("tasks", function (){
  console.log( "Matchconfirmmodal - Tasks now subscribed.");
});
