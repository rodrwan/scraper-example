'use strict';

// CONST, classes, task-name
var URL_BASE, schema, schemaOptions, Yakuza, Gurkha, _, getProductLink;

Yakuza = require('yakuza');
Gurkha = require('gurkha');
_ = require('lodash');

/**
 * Function to capitalize string
 * @param  {String} string String to capitalize
 * @return {String}        Capitalized string
 */
function capitalize (string) {
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

URL_BASE = 'http://www.terrafirma.cl';
schema = {
  '$rule': 'div.category-view div.spacer',
  'links': {
    '$rule': 'a',
    '$sanitizer': function ($elem) {
      return $elem.attr('href');
    }
  },
  'title': {
    '$rule': 'a',
    '$sanitizer': function ($elem) {
      return capitalize($elem.attr('title'));
    }
  }
};

schemaOptions = {
  'normalizeWhitespace': true
};

getProductLink = Yakuza.task('Bikes', 'TerraFirma', 'GetProductLink');

getProductLink.builder(function (job) {
  // pass the section to retrieve the corresponding url.
  return {'shopLink': job.shared('GetShopLink.shopLink')};
});

/**
 * Main function, here we write the code to extract, in this case,
 * the corresponding section url.
 */
getProductLink.main(function (task, http, params) {
  var template, requestOpts, requestUrl;

  requestUrl = URL_BASE + params.shopLink;
  template = http.optionsTemplate();

  requestOpts = template.build({
    'url': requestUrl
  });

  http.get(requestOpts).then(function (result) {
    var bodyParser, parsedBody;
    bodyParser = new Gurkha(schema, schemaOptions);
    parsedBody = bodyParser.parse(result.body);
    console.log(parsedBody);
  })
  .fail(function (err) {
    task.fail(err);
  }).done();
});
