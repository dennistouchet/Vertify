# Vertify MVP

#Session

  List of Session Variables:

    `currentWS`
      Set on TopNav.js

    `selectedSystem`
      Set on open-modal.js and used by systemeditmodal.js

    `selectedWorkspace`
      Set on open-modal.js and used by wseditmodal.js

    `systemCount`
      Set on connect.js and collect.js

    `objectCount`
      Set on collect.js

    `setupId`
      Set on vertifywizard.js

# Meteor Method calls

  Meteor calls are asynchronous and values from the call may not be present after the call completes (ex. newid)
  use caution when editing any values after Meteor.calls. Example:

  ```
  var newid = Meteor.call('collection.insert', parameters
  , (err, res) => {
    if(err){
      //console.log(err);
    }
    else{
      //success
      //Make value changes here
    }
  });
  // code run here may not have the latest values
  // (e.g. newid will probably be undefined here)
  ```

#Security

  Removed autopublish, server publish and client side subscription now must be handled for all collections.

  removed insecure. client pages can no longer make direct mongo collection calls, must use methods to access server collection calls.

# Tabular Tables

  Tabular Table code must be in the /lib folder for the Table to be found and created by aldeed:Tabular


#mongo

logging into remote mongo.

  Make sure mongo is installed on machine.

  mongo vertify.hellodata.com:27017

For a list of Databases:

  show dbs

Use a specific Database:

  use [dbs]

Updating a field:

  ```
  db.[collection].update(
    { id: 1 },
    { $set:
      { field: value, field: value }
    }
  )
  ```

  ex: `db.external_objects.update({id: 1},{ $set: { percentage: 10 } })`
