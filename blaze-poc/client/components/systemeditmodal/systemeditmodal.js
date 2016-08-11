import { Template } from 'meteor/templating';

import { Systems } from '../../../imports/collections/tenant/system.js';

Template.systemeditmodal.helpers({
  system: function(){
    var sysId = Session.get('selectedSystem');

    if(typeof sysId !== "undefined") {
      var system = Systems.findOne(sysId);
      return system;
    } else {
      return {name: '', pf:'', st: '', un:'', pw:'',maxtasks:''}
    }
  }
});

Template.systemeditmodal.events({

  'click #save': function(e) {
    e.preventDefault();
    var errDiv = document.getElementById("editErrModal");
    errDiv.innerHTML = ""; //reset errors

    //TODO: VERIFY WORKSPACE ID
    var sysId = Session.get('selectedSystem');

    var nm = document.getElementById("name");
    var pf = document.getElementById("pf");
    var st = document.getElementById("st");
    var un = document.getElementById("un");
    var pw = document.getElementById("pw");
    var maxtasks = document.getElementById("maxtasks");

    if(sysId) {
      //TODO: Fix logic error that doesn't allow it to reenter same name/prefix for itself
      var nmexists = Systems.findOne({"name" : nm.value.trim()});
      var pfexists = Systems.findOne({"prefix" : pf.value.trim()});

      if (nmexists) {
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error:</span> The system name already exists. Please use a different name</li>";
      }
      if (pfexists) {
        errDiv.style.display = 'block';
        errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error:</span> The system prefix already exists. Please use a different prefix</li>";
      }
      if(nmexists == null && pfexists == null){

      Meteor.call('systems.edit', sysId, nm.value.trim(), pf.value.trim()
        , st.value.trim(), un.value.trim(), pw.value.trim()
        , parseInt(maxtasks.value)
        , (err, res) => {
          if(err){
            //console.log(err);
            //return false;
            errDiv.style.display = 'block';
            errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
          }
          else {
            // successful call
            // return true;
            Modal.hide('systemeditmodal');
          }
        });
      }
    }
    else {
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[ Missing Value ] No System selected</li>";
    }
  }
});

Meteor.subscribe('systems', function (){
  console.log( "Systemeditmodal - Systems now subscribed.");
});
