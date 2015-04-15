'use strict';

// CONST, classes, task-name
var URL_BASE, Yakuza, cheerio, _, getSectionLink;

Yakuza = require('yakuza');
cheerio = require('cheerio');
_ = require('lodash');

URL_BASE = 'http://www.terrafirma.cl/';

getSectionLink = Yakuza.task('Bikes', 'TerraFirma', 'GetShopLink');

getSectionLink.builder(function (job) {
  // pass the section to retrieve the corresponding url.
  return {'section': job.params.section};
});

/**
 * Main function, here we write the code to extract, in this case,
 * the corresponding section url.
 */
getSectionLink.main(function (task, http, params) {
  var template, requestOpts, section;

  template = http.optionsTemplate();
  section = params.section;
  requestOpts = template.build({
    'url': URL_BASE + section + '/'
  });

  http.get(requestOpts).then(function (result) {
    var $, $links, link;
    /**
     * result has two important element, res and body.
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
    // Public final err to Yakuza.
    task.fail(err);
  }).done();
});
