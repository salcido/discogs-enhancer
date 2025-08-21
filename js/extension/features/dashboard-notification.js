rl.ready(() => {

  if ( rl.pageIs('dashboard') ) {

    let dashboard = document.querySelector('#page_aside ul.module_blocks.right'),
        forumPost = 'https://www.discogs.com/group/thread/1136261',
        isAdmin = window.dsdata().userIsAdmin,
        cookieName = 'de-subscription-notice',
        cookie = rl.getCookie(cookieName);

    let rules = /* css */`
      .de-dashboard-notification {
        --bg-col: #ffffff;
      }
      .de-dark-theme .de-dashboard-notification {
        --bg-col: var(--main-bg-color);
      }
      .de-dashboard-notification .alert-message {
        background: radial-gradient(circle at 100% 100%, var(--bg-col) 0, var(--bg-col) 8px, transparent 8px) 0% 0%/10px 10px no-repeat,
        radial-gradient(circle at 0 100%, var(--bg-col) 0, var(--bg-col) 8px, transparent 8px) 100% 0%/10px 10px no-repeat,
        radial-gradient(circle at 100% 0, var(--bg-col) 0, var(--bg-col) 8px, transparent 8px) 0% 100%/10px 10px no-repeat,
        radial-gradient(circle at 0 0, var(--bg-col) 0, var(--bg-col) 8px, transparent 8px) 100% 100%/10px 10px no-repeat,
        linear-gradient(var(--bg-col), var(--bg-col)) 50% 50%/calc(100% - 4px) calc(100% - 20px) no-repeat,
        linear-gradient(var(--bg-col), var(--bg-col)) 50% 50%/calc(100% - 20px) calc(100% - 4px) no-repeat,
        repeating-linear-gradient(45deg, #8848e0 0%, #c848e0 25%, #fe6e01 50%, rgba(245, 181, 65, 1) 75%, #efec73 100%) no-repeat;
        border-radius: 10px;
        padding: 16px;
        box-sizing: content-box;
      }

      .de-close-icon {
        float: right;
        height: 22px;
        text-decoration: none;
        font-size: 18px;
        font-weight: bold;
        color: #000;
        background: none;
        border: none;
        padding: 0px;
      }

      .de-dark-theme .de-dashboard-notification .alert-message-announcement.alert-message .alert-message-text a.de-learn-more {
        color: var(--link) !important;
      }
    `;

    let markup = /* html */`
        <div class="hide_mobile de-dashboard-notification">
          <div class="alert-message alert-message-announcement alert-message-closable alert-message-broadcast alert-message-top " role="status" aria-label="Notification">
            <div class="alert-message-content float_fix alert-message-full-width">
              <svg width="24" height="24" viewBox="0 0 439 440" version="1.1" class="icon icon-bullhorn alert-message-icon" style="fill-rule:evenodd;clip-rule:evenodd;" fill="currentColor">
                <g transform="matrix(1.08,0,0,1.08,-17.02,-17.6)">
                    <path d="M219,28C325.039,28 411,113.961 411,220C411,326.039 325.039,412 219,412C112.961,412 27,326.039 27,220C27,113.961 112.961,28 219,28Z" style="fill:none;fill-rule:nonzero;stroke:currentColor;stroke-width:16px;"/>
                </g>
                <g transform="matrix(1.08,0,0,1.08,-17.02,-17.6)">
                    <path d="M275.14,125.469C279.171,127.833 283.064,130.474 286.818,133.394C312.815,153.413 329.498,184.971 329.498,220.422C329.498,225.288 329.22,230.015 328.525,234.603C330.555,238.176 332.964,240.231 336.03,242.846C338.213,244.708 340.729,246.854 343.678,250.034C352.854,259.905 370.371,260.461 377.6,259.21C379.546,258.793 381.77,257.681 383.995,256.012C386.497,244.473 387.748,232.517 387.748,220.144C387.748,203.74 385.385,187.891 381.075,172.876C376.349,170.791 366.061,171.208 366.061,171.208L366.061,173.571C349.378,120.882 305.447,80.565 250.81,69.443L250.789,69.321L250.789,69.321C250.356,66.861 249.235,60.499 246.501,57.765C245.366,56.725 244.231,55.556 243.183,54.477L243.183,54.477C242.691,53.97 242.218,53.483 241.774,53.038C234.684,52.065 227.455,51.648 220.086,51.648C216.472,51.648 212.857,51.787 209.382,51.926C205.072,56.097 202.013,61.102 200.901,63.604C198.955,68.053 198.538,89.045 198.399,100.862C198.399,112.54 193.95,117.684 191.448,119.909L132.919,223.759C128.053,225.844 122.214,225.705 117.209,222.786C114.429,221.117 112.343,218.893 110.814,216.252C112.204,173.85 137.506,137.564 173.653,120.465C178.604,114.872 179.322,111.032 180.354,105.517C180.886,102.669 181.503,99.375 182.828,95.162C185.609,86.265 182.411,75.977 178.518,68.748C176.155,65.411 172.54,60.685 169.899,59.155C143.206,68.053 119.294,83.067 100.109,102.809C99.97,102.948 99.97,103.226 99.97,103.226C99.553,107.257 104.419,115.599 105.809,117.962C81.619,145.072 66.883,181.079 66.883,220.283C66.883,236.132 69.246,251.564 73.834,266.022C72.305,267.273 66.605,272 65.492,275.893C65.307,276.541 65.122,277.206 64.936,277.87C64.566,279.198 64.195,280.527 63.824,281.732C68.134,292.575 73.417,303.002 79.812,312.595C85.234,314.124 90.656,314.263 93.158,313.985C96.238,313.721 104.162,308.501 112.173,303.224L112.174,303.223C116.82,300.162 121.496,297.082 125.272,294.939C133.197,290.351 138.48,291.046 140.426,291.602L268.188,292.297C272.637,295.495 275.557,300.778 275.557,306.617C275.557,310.37 274.444,313.846 272.359,316.766C256.927,325.246 238.993,330.112 220.225,330.112C196.313,330.112 174.209,322.326 156.136,309.258C148.929,307.799 145.254,309.092 140.006,310.94C137.255,311.908 134.072,313.029 129.721,313.985C120.546,316.07 113.316,323.995 108.868,330.946C107.199,334.422 105.114,339.426 104.836,342.624C124.994,361.809 149.602,375.85 176.85,383.219C177.267,383.219 177.545,383.08 177.823,382.941C181.342,381.452 185.783,373.771 187.427,370.928L187.555,370.707C197.982,372.931 208.964,374.182 220.086,374.182C264.991,374.182 305.308,354.719 333.39,323.856C335.893,324.829 341.871,326.775 345.346,325.802C347.71,325.107 350.212,324.551 352.297,324.134C358.415,316.209 363.975,307.729 368.702,298.832C367.868,291.463 364.114,284.373 362.168,281.732C360.401,279.258 351.896,274.931 343.326,270.571C338.411,268.071 333.475,265.559 329.776,263.381C326.717,261.573 324.493,259.766 322.964,258.098L322.825,258.376L321.99,256.985C320.6,255.317 319.905,253.788 319.488,252.676L254.564,139.789C255.259,134.784 258.179,130.196 263.045,127.416C266.937,125.33 271.247,124.774 275.14,125.469ZM218.877,253.77C237.54,253.77 252.669,238.641 252.669,219.978C252.669,201.315 237.54,186.186 218.877,186.186C200.214,186.186 185.085,201.315 185.085,219.978C185.085,238.641 200.214,253.77 218.877,253.77Z"/>
                </g>
              </svg>
              <span class="sr-only">A Message from Discogs Enhancer</span>
              <a class="de-close-icon">
              <i role="img" aria-hidden="true" class="icon icon-times"></i>
              </a>
              <span class="alert-message-text">
                  <strong>A Message from Discogs Enhancer</strong>
                  <br>
                  Discogs Enhancer will soon be moving to a subscription model. This change is necessary to support the growing amount of work required to keep the extension running across all areas of Discogs.  <a href="${forumPost}" class="de-learn-more">Learn more.</a>
              </span>
            </div>
          </div>
        </div>
    `;

    document.body.addEventListener('click', (event) => {
      if ( event.target.classList.contains('de-close-icon')
            || event.target.classList.contains('icon-times') ) {

        rl.setCookie(cookieName, 'true', { days: 180 });
        document.querySelector('.de-dashboard-notification').style.display = 'none';
      }
    });

    if (!isAdmin && !cookie) {
      rl.attachCss('de-notification', rules);
      dashboard.insertAdjacentHTML('afterbegin', markup);
    }
  }
});
