import { Template } from 'meteor/templating';
import { Systems } from '../../../imports/collections/tenant/system.js';
import { Tasks } from '../../../imports/collections/global/task.js';

Template.systemaddmodal.helpers({
});

Template.systemaddmodal.events({
  'click .sysinfoddl li a' : function(e, template){
    console.log("Object Event: " + e + " | Event Target: " + $(e.target));
    var btnprnt = $(e.target).parent().parent().parent();
    console.log("system ddl click event" + btnprnt[0] );

    var text = e.target.text;
    document.getElementById("text").value = text;
    document.getElementById("name").value = text;
    //change button text
    //var child = btnprnt.children('.btn')
    //child.html( text + ' <span class="caret"></span>') ;
  },
  'click #save': function(e) {
    //TODO: THIS CODE IS DUPLICATED IN CONNECT.JS UNDER 'click .add'
    //MAKE ANY NEW CHANGES THERE AS WELL
    //TODO:REFACTOR TO A SINGLE PLACE\
    e.preventDefault();
    var errDiv = document.getElementById("addErrModal");
    errDiv.style.display = 'none';
    errDiv.innerHTML = ""; //reset errors

    var nm = document.getElementById("name");
    var pf = document.getElementById("pf");
    var maxtasks = document.getElementById("maxtasks");
    var settings = document.querySelectorAll('*[id^="setting_"]');
    //console.log(settings);

    // Gets the element selected by the system name added. Used to get "data-id" value
    var text = document.getElementById("text");
    var selectedItem = document.getElementById(text.value.trim());

    if(! Session.get("currentWs")){
      alert("No Workspace Selected");
    }
    else if( (nm.value === "")){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Missing Value:</span> Please enter a value for Name.</li>";
    }
    else if ( (pf.value === "")){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Missing Value:</span> Please enter a value for Prefix.</li>";
    }
    else if ( (maxtasks.value === "")){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Missing Value:</span> Please enter a value for Max Concurrent Tasks.</li>";
    }
    else if (selectedItem == null){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error:</span> Please selected a System from the list.</li>";
    }
    else {
      var sysInfoId = selectedItem.getAttribute('data-value');
      var ws = Session.get("currentWs");
      var nmexists = Systems.findOne({"name" : nm.value.trim()});
      var pfexists = Systems.findOne({"prefix" : pf.value.trim()});
      var setErr = 0;
      if (settings){
            for(i = 0; i < settings.length; i++){
              if(settings[i].value === ''){
                errDiv.style.display = 'block';
                errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error:</span> Missing Credential parameter: " + settings[i].name + ".</li>";
                setErr++;
              }
            }
      }
      var sets = [];
      for(i = 0; i < settings.length; i++){
        var set = {
          setting: settings[i].name,
          value: settings[i].value
        }
        sets.push(set);
      }

      if (nmexists) {
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error:</span>The system name already exists. Please use a different name</li>";
      }
      if (pfexists) {
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error:</span>The system prefix already exists. Please use a different prefix</li>";
      }
      if(nmexists == null && pfexists == null && setErr == 0){
        Meteor.call('systems.insert', ws.id, parseInt(sysInfoId), nm.value.trim(), pf.value.trim()
          , maxtasks.value.trim(), sets
          , (err, res) => {
            if(err){
              //console.log(err);
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
              //return false;
            }
            else {
              Meteor.call('tasks.insert', "authentication", ws.id, res
              , (error, result) => {
                if(error){
                  //console.log(err);
                  errDiv.style.display = 'block';
                  errDiv.innerHTML = errDiv.innerHTML + "<li><span>Authentication Error: </span>[" + error.error + "] " + error.reason + "</li>";
                  //return false;
                  return;
                }
                else {
                  // successful call
                  // update status of system
                  //Meteor.tools.updateSystemStatus(ws.id, res, "authentication", true);
                  Meteor.call('tasks.insert', "discover", ws.id, res
                  , (err, result) => {
                    if(err){
                      //console.log(err);
                      errDiv.style.display = 'block';
                      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Discover Error: </span>[" + err.error + "] " + err.reason + "</li>";
                      //return false;
                      return;
                    }
                    else {
                      // successful call
                      // update status of system
                      //Meteor.tools.updateSystemStatus(ws.id, res, "discover", true);
                      Meteor.call('tasks.insert', "scan", ws.id, res
                      , (err, result) => {
                        if(err){
                          //console.log(err);
                          errDiv.style.display = 'block';
                          errDiv.innerHTML = errDiv.innerHTML + "<li><span>Scan Error: </span>[" + err.error + "] " + err.reason + "</li>";
                          //return false;
                          return;
                        }
                        else {
                          // successful call
                          // update status of system
                          //Meteor.tools.updateSystemStatus(ws.id, res, "scan", true);
                          Modal.hide('systemaddmodal');
                        }
                      });
                    }
                  });
                }
              });
            }
          });
      }
      else {
        //TODO: show error
      }
    }
  }
});

Meteor.subscribe("systems", function (){
  console.log( "Systemaddmodal - Systems now subscribed.");
});


Meteor.subscribe("tasks", function (){
  console.log( "Systemaddmodal - Tasks now subscribed.");
});
