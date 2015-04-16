'use strict';

// CONST, classes, task-name
var URL_BASE, Yakuza, cheerio, _, getShopLink;

Yakuza = require('yakuza');
cheerio = require('cheerio');
_ = require('lodash');

/**
 * Base url of the web page.
 */
URL_BASE = 'http://www.terrafirma.cl/';

/**
 * Task GetShopLink of Bikes Agent.
 */
getShopLink = Yakuza.task('Bikes', 'TerraFirma', 'GetShopLink');

/**
 * Builder of Bikes task, this builder pass data from Job.
 */
getShopLink.builder(function (job) {
  // pass the section to retrieve the corresponding url.
  return {'section': job.params.section};
});

/**
 * Hook to make retries, modify data.
 */
getShopLink.hooks({
  // if something fail, make 3 retries.
  'onFail': function (task) {
    // 3 retries, then stop.
    if (task.runs === 3) {
      return false;
    }
    return task.rerun();
  }
});
/**
 * Main function, here we write the code to extract, in this case,
 * shop link.
 */
getShopLink.main(function (task, http, params) {
  var template, requestOpts, section;

  template = http.optionsTemplate();
  section = params.section;

  requestOpts = template.build({
    'url': URL_BASE + section + '/'
  });

  http.get(requestOpts).then(function (result) {
    var $, $links, link;
    /**
     * `result` has two important element, res and body.
     * res: include all relative to http response.
     * body: html response.
     */
    $ = cheerio.load(result.body, {
          'normalizeWhitespace': true
        });

    $links = $('a');
    _.every($links, function ($link) {
      link = $($link).attr('href');

      if (link.indexOf('shop') >= 0) {
        return false;
      }
      return true;
    });

    task.share('shopLink', link);
    task.success('Link found.');
  }).fail(function (err) {
    // Public final error to Yakuza.
    task.fail(err);
  }).done();
});
