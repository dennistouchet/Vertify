import { Template } from 'meteor/templating';
import { Systems } from '../../../imports/collections/tenant/system.js';

Template.systemeditmodal.onCreated(function(){
  Meteor.subscribe('systems', function (){
    console.log( "Systemeditmodal - Systems now subscribed.");
  });
});

Template.systemeditmodal.helpers({
  system: function(){
    var sys_id = Session.get('selectedSystem');

    if(typeof sys_id !== "undefined") {
      var system = Systems.findOne(sys_id);
      return system;
    } else {
      return {name: '', pf:'', st: '', un:'', pw:'',maxtasks:''};
    }
  }
});

Template.systemeditmodal.events({

  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("editErrModal");
    errDiv.style.display = 'none';
    errDiv.innerHtml = ''; //reset errors

    //TODO: VERIFY WORKSPACE ID
    var sys_id = Session.get('selectedSystem');

    var ws = Session.get('currentWs');
    var nm = document.getElementById("name");
    var pf = document.getElementById("pf");
    var maxtasks = document.getElementById("maxtasks");
    var settings = document.querySelectorAll('*[id^="setting_"]');

    if(sys_id) {
      var nmexists = Systems.findOne({"_id":  {$ne: sys_id}, "name" : nm.value.trim()});
      var pfexists = Systems.findOne({"_id":  {$ne: sys_id}, "prefix" : pf.value.trim()});

      var setErr = 0;
      if (settings){
            for(i = 0; i < settings.length; i++){
              if(settings[i].value === ''){
                errDiv.style.display = 'block';
                errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error:</span> Missing Credential parameter: ' + settings[i].name + '.</li>';
                setErr++;
              }
            }
      }
      var sets = [];
      for(i = 0; i < settings.length; i++){
        var set = {
          setting: settings[i].name,
          value: settings[i].value
        };
        console.log(set);
        sets.push(set);
      }

      if (nmexists) {
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error:</span> The system name already exists. Please use a different name</li>';
      }
      if (pfexists) {
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error:</span> The system prefix already exists. Please use a different prefix</li>';
      }
      if(nmexists === 'undefined' && pfexists === 'undefined' && setErr === 0){
      Meteor.call('systems.edit', ws._id, sys_id, nm.value.trim(), pf.value.trim(),
         parseInt(maxtasks.value), sets,
         (err, res) => {
          if(err){
            //console.log(err);
            //return false;
            errDiv.style.display = 'block';
            errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[' + err.error + '] ' + err.reason + '</li>';
          }
          else {
            Meteor.call('tasks.insert', "authentication", ws._id, res,
             (error, result) => {
              if(error){
                //console.log(err);
                errDiv.style.display = 'block';
                errDiv.innerHTML = errDiv.innerHTML + '<li><span>Authentication Error: </span>[' + error.error + '] ' + error.reason + '</li>';
                //return false;
                return;
              }
              else {
                // successful call
                Meteor.call('tasks.insert', "discover", ws._id, res,
                 (err, result) => {
                  if(err){
                    //console.log(err);
                    errDiv.style.display = 'block';
                    errDiv.innerHTML = errDiv.innerHTML + '<li><span>Discover Error: </span>[' + err.error + '] ' + err.reason + '</li>';
                    //return false;
                    return;
                  }
                  else {
                    // successful call
                    Meteor.call('tasks.insert', "scan", ws._id, res,
                     (err, result) => {
                      if(err){
                        //console.log(err);
                        errDiv.style.display = 'block';
                        errDiv.innerHTML = errDiv.innerHTML + '<li><span>Scan Error: </span>[' + err.error + '] ' + err.reason + '</li>';
                        //return false;
                        return;
                      }
                      else {
                        // successful call

                        Modal.hide('systemeditmodal');
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
    else {
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[ Missing Value ] No System selected</li>';
    }
  }
});
