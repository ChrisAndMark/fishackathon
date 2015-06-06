// flightplan.js
var plan   = require('flightplan'),
    config = require(__dirname + '/config/config.json');

// Get the list of servers from the config
for (var i = 0; i < config.servers.length; i++) {
  var server = config.servers[i];

  // Setup the server agent to the unix SSH socket
  if (server.agent == "ssh") {
    server.agent = process.env.SSH_AUTH_SOCK;
  } else {
    console.log(server.name + ": Server agent must be 'ssh'");
    return;
  }

  plan.target(server.name, server, server.options);
}

var folders = {};

// This function builds the assets and then delivers them to the
// upload directory on the specified host.
plan.local(function(local) {
  var git, public, config;

  for (var folder in folders) {
    local.log(folder);
  }

  local.log('Compile the assets locally');
  local.exec('grunt build', {silent: true});

  local.log('Collect all assets');
  git = local.exec('git ls-files', {silent: true}).stdout.split('\n');
  public = local.find('.tmp -type f', {silent: true}).stdout.split('\n');
  config = local.find('config -type f', {silent: true}).stdout.split('\n');

  // rsync files to all the target's remote hosts
  local.log('Transfer the found assets to the remote host');
  local.transfer(git, '/home/deployer/tmp');

  // Copy the non-git files onto the server
  local.transfer(public.concat(config), '/home/deployer/tmp');
  local.exec('grunt clear', {silent: true});
});

// Setup all the directories needed if they dont exist
plan.remote(function(remote) {
  folders = {
    root:     plan.runtime.options.webRoot,
    current:  plan.runtime.options.webRoot + 'current',
    shared:   plan.runtime.options.webRoot + 'shared',
    node_modules: plan.runtime.options.webRoot + 'shared/node_modules',
    logs: plan.runtime.options.webRoot + 'shared/logs',
    pids: plan.runtime.options.webRoot + 'shared/pids',
    source:   plan.runtime.options.webRoot + 'source',
    newBuild: plan.runtime.options.webRoot + 'source/' + new Date().getTime()
  }

  remote.log('Setup directory structure using the current webroot');
  for (var folder in folders) {
    if (folder == 'newBuild' || folder == 'current') continue;

    remote.mkdir(folders[folder], {failsafe: true, silent: true});
  }

  // Rename the temp folder to public for server purposes
  remote.mv('/home/deployer/tmp/.tmp /home/deployer/tmp/public', {silent: true});
  remote.mv('/home/deployer/tmp ' + folders.newBuild, {silent: true});
});

plan.remote(function(remote) {
  remote.log('Linking all the shared folders to the new build');
  remote.ln('-sf ' + folders.logs + ' ' + folders.newBuild + '/logs', {silent: true});
  remote.ln('-sf ' + folders.pids + ' ' + folders.newBuild + '/pids', {silent: true});
  remote.ln('-sf ' + folders.node_modules + ' ' + folders.newBuild + '/node_modules', {silent: true});

  remote.with('cd ' + folders.newBuild, function() {

    remote.log('Removing unused node packages');
    remote.exec('npm prune --production');

    remote.log('Installing new node packages');
    remote.exec('npm install --production --ignore-scripts');
  });

  remote.log('Setting the new build as the current build');
  remote.rm('-rf ' + folders.current, {silent: true});
  remote.ln('-s ' + folders.newBuild + ' ' + folders.current, {silent: true});

  remote.log('Restarting the server using pm2');
  remote.exec('pm2 startOrGracefulReload ' + folders.current + plan.runtime.options.pm2Config);
});

// This section will delete the oldest build if there are more than 5
plan.remote(function(remote) {
  var previousBuilds = remote.exec('ls ' + folders.source, {silent: true}).stdout.split('\n');
  var oldestBuild = new Date().getTime();

  // Converting the output of ls to an array tacks on an extra blank element
  // If that element exists, remove it
  if (previousBuilds[previousBuilds.length - 1] == 0) {
    previousBuilds = previousBuilds.splice(0, previousBuilds.length - 1);
  }

  // If there are less than 5 builds, dont bother deleting one
  remote.log('Number of builds found: ' + previousBuilds.length);
  if (previousBuilds.length > 5) {
    // Find the oldest build
    for (var i = 0; i < previousBuilds.length; i++) {
      if (previousBuilds[i] < oldestBuild) {
        oldestBuild = previousBuilds[i];
      }
    }

    remote.log('Removing the oldest build: ' + oldestBuild);
    remote.rm('-rf ' + folders.source + '/' + oldestBuild);
  }
});