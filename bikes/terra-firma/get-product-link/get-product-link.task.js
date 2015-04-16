'use strict';

// CONST, classes, task-name
var URL_BASE, SCHEMA, schemaOptions, Yakuza, Gurkha, _, getProductLink;

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

/**
 * Base url of the web page.
 */
URL_BASE = 'http://www.terrafirma.cl';

/**
 * Schema to extract values from html
 */
SCHEMA = {
  '$rule': 'div.category-view div.spacer',
  'title': {
    '$rule': 'a',
    '$sanitizer': function ($elem) {
      return capitalize($elem.attr('title'));
    }
  },
  'link': {
    '$rule': 'a',
    '$sanitizer': function ($elem) {
      return $elem.attr('href');
    }
  },
  'image': {
    '$rule': 'img',
    '$sanitizer': function ($elem) {
      return $elem.attr('src');
    }
  }
};

/**
 * Basic options to normalize HTML response.
 */
schemaOptions = {
  'normalizeWhitespace': true
};

/**
 * Task GetProductLink of Bikes Agent.
 */
getProductLink = Yakuza.task('Bikes', 'TerraFirma', 'GetProductLink');

/**
 * Builder of Bikes task, this builder pass extra data, extracted
 * from previous task to main function.
 */
getProductLink.builder(function (job) {
  return {'shopLink': job.shared('GetShopLink.shopLink')};
});

/**
 * Hook to make retries, modify data.
 */
getProductLink.hooks({
  // if something fail, make 3 retries.
  'onFail': function (task) {
    // 3 retries, then stop.
    if (task.runs === 3) {
      return false;
    }
    return task.params;
  },
  // Dummy example, possible filter usage.
  // Join base url to retrieved links.
  'onSuccess': function (task) {
    var newData;

    newData = [];
    _.each(task.data, function (data) {
      data.link = URL_BASE + data.link;
      data.image = URL_BASE + data.image;
      newData.push(data);
    });

    return newData;
  }
});

/**
 * Main function, here we write the code to extract, in this case,
 * the corresponding section url.
 * - Request 1: Get shop page
 */
getProductLink.main(function (task, http, params) {
  var template, requestOpts, requestUrl;

  template = http.optionsTemplate();
  requestUrl = URL_BASE + params.shopLink;

  requestOpts = template.build({
    'url': requestUrl
  });

  // Request 1: Extract title, link and image
  // url from HTML response
  // ========================================
  http.get(requestOpts).then(function (result) {
    var bodyParser, parsedBody;

    // Parse body using Gurkha
    bodyParser = new Gurkha(SCHEMA, schemaOptions);
    parsedBody = bodyParser.parse(result.body);

    task.success(parsedBody);
  })
  .fail(function (err) {
    task.fail(err);
  }).done();
});
