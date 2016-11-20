import { Template } from 'meteor/templating';
import { Workspaces } from '../../../../imports/collections/tenant/workspace.js';
import './workspaces.html';

Template.workspaces.helpers({
  workspaces() {
    return Workspaces.find({});
  },
});

Template.workspaces.events({
  'submit .new-workspace'(e){
    e.preventDefault();
    var errDiv = document.getElementById("addErrWorkspace");
    errDiv.innerHTML = ""; //reset errors
    errDiv.style.display = 'none';

    const target = e.target;
    const text = target.text.value;

    Meteor.call('workspaces.insert'
    , text
    , (err, res) => {
      if(err){
        //console.log(err);
        //TODO: improve with error Template
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
      }
      else {
        // successful call
        // return true;
      }
    });

    target.text.value = '';
  },
  'click .add' : function(e) {
    var errDiv = document.getElementById("addErrWorkspace");
    errDiv.innerHTML = ""; //reset errors
    errDiv.style.display = 'none';

    var target = document.getElementById("text");
    if(! (target.value === ""))
    {
      Meteor.call('workspaces.insert'
      , target.value
      , (err, res) => {
        if(err){
          //console.log(err);
          //TODO: improve with error Template
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
        }
        else {
          // successful call
          // When WS is added, set new WS to current  and redirect to Setup Page
          var ws = Workspaces.findOne({"name": target.value});
          Session.set("currentWs", ws);
          FlowRouter.go('/setup');
        }
      });
    }
    target.value = '';
  },
  'click .clear' : function() {
      document.getElementById("text").value = '';
  },
  'click .delete' : function(){
      var errDiv = document.getElementById("addErrWorkspace");
      errDiv.innerHTML = ""; //reset errors
      errDiv.style.display = 'none';

      Meteor.call('workspaces.remove'
      , this._id
      , (err, res) => {
        if(err){
          //console.log(err);
          //TODO: improve with error Template
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
        }
        else {
          // successful call
          // If the Workspace being deleted is the current Workspace
          // all of the session variables set by the workspace need to be deleted.
          var ws = Session.get("currentWs");
          if(this._id == ws._id){
            delete Session.keys["currentWs", "systemCount", "objectCount"];
            // Clear all keys and remove
            //Object.keys(Session.keys).forEach(function(key){ Session.set(key, undefined); })
            //Session.keys = {}
          }
        }
      });
  },
  'click .empty' : function(){
      var errDiv = document.getElementById("addErrWorkspace");
      errDiv.style.display = 'none';
      errDiv.innerHTML = ""; //reset errors
      var ws = Session.get("currentWs");

      Meteor.tools.deleteAllWorkspaceData(ws._id
      , (err, res) =>{
        if(error){
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
        }else{

        }
      });
  },
  'click .edit' : function(e){
    e.preventDefault();

    workspace = $(e.target).closest('.workspace');
    ws_id = workspace.attr('data-id');

    ModalHelper.openWsEditModalFor(ws_id);

    console.log("workspaces edit clicked for id: " + ws_id );
  },
  'click .addModal' : function(e){
    e.preventDefault();

    ModalHelper.openWsAddModalFor();

    console.log('workspaces add modal clicked.')
  },
});
