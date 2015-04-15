'use strict';

var Yakuza;

Yakuza = require('Yakuza');

// require agents
require('./terra-firma/terra-firma.agent');

Yakuza.scraper('Bikes').routine('FirstRun', [
  'GetShopLink',
  'GetProductLink'
]);
