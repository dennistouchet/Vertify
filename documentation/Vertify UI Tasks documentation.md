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

- [ ] Authenticate:
    Takes place when a system is first created by the user on the Setup -> Connect page. The task uses the entered credentials to verify connection to the external system. The Tasks itself is called after a System ID result is returned by the successful creation of the new System object in the Systems collection by ‘system.insert’
- [ ] Discover:
    Upon successful authentication, the discover task should be triggered. This task should retrieve external_objects from the system and add them to the system object designated by the system id parameter of the task.
- [ ] CollectSchema:
    when an 
- [ ] Collect
- [ ] MatchTest
- [ ] Match
- [ ] AlignTest
- [ ] Align
- [ ] Analyze
- [ ] Fix
- [ ] Sync
- [ ] Schedule
