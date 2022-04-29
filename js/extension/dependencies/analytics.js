/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

let analytics = __ANALYTICS__;

if ( analytics ) {

  ga('create', 'UA-75073435-1', 'auto');
  ga('set', 'anonymizeIp', true);
  ga('set', 'checkProtocolTask', function() { });
  ga('require', 'displayfeatures');
}
