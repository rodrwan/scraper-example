'use strict';

var Yakuza;

Yakuza = require('yakuza');


// require tasks
require('./get-shop-link/get-shop-link.task');

Yakuza.agent('Bikes', 'TerraFirma')
  .setup(function (config) {
    config.plan = [
      'GetShopLink'
    ];
  })
  .routine('FirstRun', [
    'GetShopLink'
  ]);
