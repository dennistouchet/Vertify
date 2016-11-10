const setupRoutes = FlowRouter.group({
  prefix: '/setup',
  name: 'setup',
  triggersEnter: [() => {
    window.scrollTo(0, 0);
  }],
});

const dataRoutes = FlowRouter.group({
  prefix: '/data',
  name: 'data',
  triggersEnter: [()=> {
    window.scrollTo(0,0);
  }],
});

FlowRouter.route('/', {
  name: 'dashboard',
  action() {
      BlazeLayout.render('main', {main: 'dashboard'});
  }
});

FlowRouter.route('/admin', {
  name: 'admin',
  action() {
      BlazeLayout.render('main', {main: 'admin'});
  }
});

FlowRouter.route('/admin/agents', {
  name: 'agents',
  action() {
      BlazeLayout.render('main', {main: 'agents'});
  }
});

FlowRouter.route('/admin/groups', {
  name: 'groups',
  action() {
      BlazeLayout.render('main', {main: 'groups'});
  }
});

FlowRouter.route('/admin/users', {
  name: 'users',
  action() {
      BlazeLayout.render('main', {main: 'users'});
  }
});

FlowRouter.route('/admin/workspaces', {
  name: 'workspaces',
  action() {
      BlazeLayout.render('main', {main: 'workspaces'});
  }
});

dataRoutes.route('/', {
  name: 'data',
  action() {
      BlazeLayout.render('main', {main: 'data'});
  }
});

dataRoutes.route('/analyze', {
  name: 'analyze',
  action() {
      BlazeLayout.render('main', {main: 'analyze'});
  }
});

dataRoutes.route('/fix', {
  name: 'fix',
  action() {
      BlazeLayout.render('main', {main: 'fix'});
  }
});

dataRoutes.route('/fix/details', {
  name: 'details',
  action() {
      BlazeLayout.render('main', {main: 'details'});
  }
});

dataRoutes.route('/fix/records', {
  name: 'records',
  action() {
      BlazeLayout.render('main', {main: 'records'});
  }
});

dataRoutes.route('/schedule', {
  name: 'schedule',
  action() {
      BlazeLayout.render('main', {main: 'schedule'});
  }
});

dataRoutes.route('/search', {
  name: 'search',
  action() {
      BlazeLayout.render('main', {main: 'search'});
  }
});

dataRoutes.route('/sync', {
  name: 'sync',
  action() {
      BlazeLayout.render('main', {main: 'sync'});
  }
});

setupRoutes.route('/', {
  name: 'setup',
  action() {
      BlazeLayout.render('main', {main: 'setup'});
  }
});

setupRoutes.route('/align', {
  name: 'align',
  action() {
      BlazeLayout.render('main', {main: 'align'});
  }
});

setupRoutes.route('/align/process', {
  name: 'alignprocess',
  action: function(queryParams) {
      console.log("queryParams: ");
      console.log(queryParams);
      BlazeLayout.render('main', {main: 'alignprocess'});
  }
});

setupRoutes.route('/align/results', {
  name: 'alignresults',
  action() {
      BlazeLayout.render('main', {main: 'alignresults'});
  }
});

setupRoutes.route('/align/fieldeditor', {
  name: 'fieldeditor',
  action() {
      BlazeLayout.render('main', {main: 'fieldeditor'});
  }
});

setupRoutes.route('/collect', {
  name: 'collect',
  action() {
      BlazeLayout.render('main', {main: 'collect'});
  }
});

setupRoutes.route('/connect', {
  name: 'connect',
  action() {
      BlazeLayout.render('main', {main: 'connect'});
  }
});

setupRoutes.route('/match', {
  name: 'match',
  action() {
      BlazeLayout.render('main', {main: 'match'});
  }
});

setupRoutes.route('/match/vertifywizard', {
  name: 'vertifywizard',
  action() {
      BlazeLayout.render('main', {main: 'vertifywizard'});
  }
});

setupRoutes.route('/match/process', {
  name: 'process',
  action: function(queryParams) {
      console.log("queryParams: ");
      console.log(queryParams);
      BlazeLayout.render('main', {main: 'process'});
  }
});

setupRoutes.route('/match/loading', {
  name: 'loading',
  action: function(queryParams) {
      console.log("queryParams: ");
      console.log(queryParams);
      BlazeLayout.render('main', {main: 'matchloading'});
  }
});

setupRoutes.route('/match/results', {
  name: 'results',
  action() {
      BlazeLayout.render('main', {main: 'matchresults'});
  }
});

FlowRouter.route('/test', {
  name: 'test',
  action() {
      BlazeLayout.render('main', {main: 'test'});
  }
});

FlowRouter.route('/test2', {
  name: 'test2',
  action() {
      BlazeLayout.render('main', {main: 'test2'});
  }
});

FlowRouter.notFound = {
  action() {
      BlazeLayout.render('main', {main: 'notfound'});
  }
};
