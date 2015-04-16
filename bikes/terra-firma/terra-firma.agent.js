'use strict';

var Yakuza;

Yakuza = require('yakuza');


// require tasks
require('./get-shop-link/get-shop-link.task');
require('./get-product-link/get-product-link.task');

Yakuza.agent('Bikes', 'TerraFirma')
  .plan([
    'GetShopLink',
    'GetProductLink'
  ])
  .routine('FirstRun', [
    'GetShopLink',
    'GetProductLink'
  ]);
