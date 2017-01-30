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
    errDiv.innerHtml = ''; //reset errors
    errDiv.style.display = 'none';

    const target = e.target;
    const text = target.text.value;

    Meteor.call('workspaces.insert', text,
     (err, res) => {
      if(err){
        //console.log(err);
        //TODO: improve with error Template
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[' + err.error + '] ' + err.reason + '</li>';
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
    errDiv.innerHtml = ''; //reset errors
    errDiv.style.display = 'none';

    var target = document.getElementById("text");
    if(!(target.value === 'undefined' || target.value === ''))
    {
      Meteor.call('workspaces.insert', target.value,
       (err, res) => {
        if(err){
          //console.log(err);
          //TODO: improve with error Template
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[' + err.error + '] ' + err.reason + '</li>';
        }
        else {
          // successful call
          // When WS is added, set new WS to current  and redirect to Setup Page
          var ws = Workspaces.findOne({"name": target.value});
          Session.set('currentWs', ws);
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
      errDiv.innerHtml = ''; //reset errors
      errDiv.style.display = 'none';

      Meteor.call('workspaces.remove', this._id,
       (err, res) => {
        if(err){
          //console.log(err);
          //TODO: improve with error Template
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[' + err.error + '] ' + err.reason + '</li>';
        }
        else {
          // successful call
          // If the Workspace being deleted is the current Workspace
          // all of the session variables set by the workspace need to be deleted.
          var ws = Session.get('currentWs');
          if(this._id == ws._id){
            delete Session.keys['currentWs', 'systemCount', 'objectCount'];
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
    errDiv.innerHtml = ''; //reset errors
    var ws = Session.get('currentWs');

    if(ws._id == this._id){
      Meteor.tools.deleteAllWorkspaceData(this._id,
       (err, res) =>{
        if(error){
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[' + err.error + '] ' + err.reason + '</li>';
        }else{
          console.log("Workspace Data Cleared Successfully!");
        }
      });
    }else{
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + '<li><span> Workspace Error: </span>[ Deletion Error ] The current workspace and the seleccted workspace do not match. Verify a workspace is selected from the Workspace menu and it matches the workspace you are trying to clear.</li>';
    }
  },
  'click .edit' : function(e){
    e.preventDefault();
    console.log("Edit clicked");
    console.log(e);
    workspace = $(e.target).closest('.workspace');
    ws_id = workspace.attr('data-id');

    ModalHelper.openWsEditModalFor(ws_id);

    console.log("workspaces edit clicked for id: " + ws_id );
  },
  'click .addModal' : function(e){
    e.preventDefault();

    ModalHelper.openWsAddModalFor();

    console.log('workspaces add modal clicked.');
  },
});
