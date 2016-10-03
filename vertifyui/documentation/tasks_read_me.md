#Vertify UI Tasks documentation

Precis: From the context of the UI, Tasks are a collection used by the interface to trigger a processing event on the engine. When a process needs to be started, the UI creates a new task and inserts it into the Tasks collection with the necessary parameters for that task.



###Import the task.js collection schema and methods:
```
	Import { Tasks } from ‘../../../../imports/collections/global/task.js’
```
###Subscribe to the collections publications:
```
	Meteor.subscribe( ‘tasks’, function(){
		console.log(‘Subscribed to Tasks’);
});
```

###Calling a task:
```
	Meteor.call(‘task.insert’, “task”, workspace_id, param, …
	, (error, result) => {
		//error
	}else{
		//success
	});
```

- [x] Authenticate:
    This task takes place when a system is first created by the user on the Setup -> Connect page. The task uses the entered credentials to verify connection to the external system. The Tasks itself is called after a System ID result is returned by the successful creation of the new System object in the Systems collection by ‘system.insert’
- [x] Discover:
    Upon successful authentication, the discover task should be triggered. This task should retrieve external_objects from the system and add them to the system object designated by the system id parameter of the task.
- [X] CollectSchema:
    This task takes place when an external_object is first added to a system on the Setup -> Collect page. This task should retrieve the schema (i.e. the external_objects properties.) and should trigger the collect task when it has finished successfully.
- [X] Collect
		Upon successful collectSchema, the collect task should be triggered. This task should retrieve the data for the external_objects and add them to the workspace's workspace data MongoDB (not the meteor mongodb)
- [X] MatchTest: Clicking 'Match' on the Setup -> Match -> Match/Process\* page will trigger the matchtest task. This task will update the match results collection for this vertify_object.
- [X] Match:
- [X] AlignTest:
- [X] Align
- [ ] Analyze
- [ ] Fix
- [ ] Sync
- [ ] Schedule

Checking status and look for existing task type with necessary values
ex: see if authentication, wsid, sysid exists if system status = incomplete. if not exist create, else nothing.




\*After a user creates a new, or updates an existing, vertify_object, it appears on the Match page and they can select the action *Match*. This will bring them to an Process page where they can select filter
