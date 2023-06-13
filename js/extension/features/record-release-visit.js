/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ----------------------------------------------------------
 * Overview
 * ----------------------------------------------------------
 *
 * Record release visit to database.
 *
 */

rl.ready(() => {
  if (rl.pageIsNot('release')) return;
  // Get the user from preferences
  const username = rl.getPreference('username');
  // Get the href and releaseId
  const href = window.location.href,
    releaseId = href.split('/release/')[1].split('-')[0];
  // Define the function to record the visit
  async function recordReleaseVisit() {
    try {
      let url = `https://api.ozma.works/release_visit`;
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          username,
          release_id: releaseId,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (err) {
      console.log('Error recording release visit', err);
    }
  }
  // Record the visit
  recordReleaseVisit();
});
