'use strict';

var Yakuza;

Yakuza = require('yakuza');

// require agents
require('./terra-firma/terra-firma.agent');

Yakuza.scraper('Bikes').routine('FirstRun', [
  'GetShopLink',
  'GetProductLink'
]);
