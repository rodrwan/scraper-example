'use strict';

var Yakuza, _, colors, params, job;

// here, require the scrapers
require('./bikes/bikes.scraper');

Yakuza = require('yakuza');
_ = require('lodash');
colors = require('colors');

// tools for debug
colors.setTheme({
  'silly': 'rainbow',
  'input': 'grey',
  'verbose': 'cyan',
  'prompt': 'grey',
  'info': 'green',
  'data': 'grey',
  'help': 'cyan',
  'warn': 'yellow',
  'debug': 'blue',
  'error': 'red'
});

// section can be: bikes or mx
params = {
  'section': 'bikes'
};

// Scraper, Agent, Options
job = Yakuza.job('Bikes', 'TerraFirma', params);

job.routine('FirstRun');

job.on('job:fail', function (res) {
  console.log('Something failed'.error);
  console.log('Error is: '.error);
  console.log(res);
});

job.on('task:*:success', function (task) {
  console.log(task.data);
});

job.run();
