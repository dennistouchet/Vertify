import { Template } from 'meteor/templating';
import { Systems } from '../../../imports/collections/tenant/system.js';


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
    errDiv.innerHTML = ""; //reset errors

    var nm = document.getElementById("name");
    var pf = document.getElementById("pf");
    var st = document.getElementById("st");
    var un = document.getElementById("un");
    var pw = document.getElementById("pw");
    var maxtasks = document.getElementById("maxtasks");

    // Gets the element selected by the system name added. Used to get "data-id" value
    var text = document.getElementById("text");
    var selectedItem = document.getElementById(text.value.trim());

    if(!Session.get("currentWs")){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error:</span>Please set the current Workspace.</li>";
    }
    else if( (nm.value === "")){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Missing Value:</span> Please enter a value for Name.</li>";
    }
    else if ( (pf.value === "")){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Missing Value:</span> Please enter a value for Prefix.</li>";
    }
    else if ( (st.value === "")){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Missing Value:</span> Please enter a value for System Type.</li>";
    }
    else if ( (un.value === "")){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Missing Value:</span> Please enter a value for Username.</li>";
    }
    else if ( (pw.value === "")){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + "<li><span>Missing Value:</span> Please enter a value for Password. </li>";
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

      //TODO: decide if this should have duplicate existance on front/back end.
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
        Meteor.call('systems.insert', ws.id, sysInfoId, nm.value.trim(), pf.value.trim()
          , st.value.trim(), un.value.trim(), pw.value.trim()
          , maxtasks.value.trim()
          , (err, res) => {
            if(err){
              //console.log(err);
              errDiv.style.display = 'block';
              errDiv.innerHTML = errDiv.innerHTML + "<li><span>Error: </span>[" + err.error + "] " + err.reason + "</li>";
              //return false;
            }
            else {
              // successful call
              // return true;
              Modal.hide('systemmodal');
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
  console.log( "Connect - Systems now subscribed.");
});
