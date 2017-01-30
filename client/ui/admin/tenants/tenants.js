import { Template } from 'meteor/templating';
import { Tenants } from '../../../../imports/collections/global/tenant.js';

const _LICENSES = [ "basic", "standard", "business", "corporate"];

Template.tenants.onCreated(function(){
    Meteor.subscribe('tenants', function(){
      console.log("Users - Tenants collection subscribed");
    });
    Meteor.subscribe('users', function(){
      console.log("Users - Users collection subscribed");
    });
    Meteor.subscribe('roles', function(){
      console.log("Users - Roles collection subscribed");
    });
});

Template.tenantadministration.helpers({
  tenants(){
    console.log(Tenants.find());
    return Tenants.find({});
  },
});

Template.addtenant.helpers({
  licenses(){
    licenses = _LICENSES;
    console.log(licenses);
    return licenses;
  }
});

Template.addtenant.events({
  'click .new': function(e,t){
    //clear fields on toggle close
    if(document.getElementById('newtenant').className.indexOf('in') > -1){
      document.getElementById('name').value = '';
      document.getElementById('license').value = '';
    }
  },
  'click .licenseddl li a': function(e,t){
    console.log(e.target);
    //TODO: set text in input field
    document.getElementById('license').value = e.target.text;
  },
  'click .save':function(e,t){
    console.log('save tenant event clicked');
    e.preventDefault();
    var errDiv = document.getElementById('addErrTenant');
    errDiv.style.display = 'none';
    errDiv.innerHTML = ''; //reset errors

    //validate inputs
    var errcnt = 0;
    var name = document.getElementById("name").value;
    var license = document.getElementById("license").value;
    if(!name){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + '<li><span>Missing Field: </span>[ Please enter a Tenant name. ]</li>';
      errcnt += 1;
    }
    if(!license){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + '<li><span>Missing Field: </span>[ Please select a license type. ]</li>';
      errcnt += 1;
    }
    else if(!(_LICENSES.indexOf(license) > -1)){
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + '<li><span>Invalid Field: </span>[ Please enter a valid license type. ]</li>';
      errcnt += 1;
    }

    if(errcnt === 0){

    Meteor.call('tenant.insert', name, license,
      (error, result)=>{
        if(error){
          //console.log(error);
          //TODO: improve with error Template
          errDiv.style.display = 'block';
          errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error: </span>[' + error.error + ' ' + error.reason + '] ' + error.details + '</li>';
        }
        else{
          document.getElementById('name').value = '';
          document.getElementById('license').value = '';
          $(document.getElementById('newtenant')).collapse('hide');

        }
      });
    }
  },
});
