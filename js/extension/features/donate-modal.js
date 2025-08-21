/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This checks the current date and displays a donation modal
 * twice a year - around the summer and winter solstices.
 */

rl.ready(() => {
  // ========================================================
  // Template Strings
  // ========================================================

  const bullhornIcon = `
  <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M512 218.31C512 219.063 512 219.813 512 220.56C511.327 231.02 507.107 239.693 499.34 246.58C492.72 252.453 485.01 255.507 476.21 255.74C475.81 255.75 475.5 256.08 475.5 256.48C475.5 292.24 475.51 327.83 475.53 363.25C475.537 377.383 469.88 388.32 458.56 396.06C452.827 399.98 446.33 401.94 439.07 401.94C438.75 401.94 438.43 401.83 438.18 401.62C418.293 385.013 396.92 369.37 374.06 354.69C346.893 337.243 318.507 323.067 288.9 312.16C263.293 302.733 236.923 296.6 209.79 293.76C208.023 293.573 206.367 293.767 204.82 294.34C194.26 298.233 185.903 304.87 179.75 314.25C176.03 319.917 173.657 326.03 172.63 332.59C171.65 338.85 171.99 344.873 173.65 350.66C175.397 356.747 178.45 362.16 182.81 366.9C183.19 367.32 183.26 367.93 182.98 368.42C176.673 379.467 175.163 390.443 178.45 401.35C180.037 406.597 183.29 412.273 188.21 418.38C193.83 425.34 200.153 431.623 207.18 437.23C209.867 439.377 211.837 440.973 213.09 442.02C215.003 443.627 216.96 445.223 218.96 446.81C219.22 447.01 219.3 447.37 219.14 447.66C215.373 454.687 210.077 460.15 203.25 464.05C197.51 467.33 191.657 469.793 185.69 471.44C163.93 477.433 142.323 476.713 120.87 469.28C114.19 466.967 107.943 463.407 102.13 458.6C101.82 458.34 101.59 458.01 101.46 457.63C96.5267 443.05 91.6633 428.61 86.87 414.31C84.95 408.597 83.2667 402.96 81.82 397.4C79.9133 390.073 78.4733 384.357 77.5 380.25C75.9733 373.83 74.83 367.153 74.07 360.22C73.37 353.847 73.1267 347.19 73.34 340.25C73.6133 331.483 74.3867 322.76 75.66 314.08C76.16 310.64 76.8533 307.113 77.74 303.5C78.5933 299.993 79.5067 296.513 80.48 293.06C80.56 292.77 80.35 292.49 80.06 292.49C67.9333 292.61 55.9967 292.5 44.25 292.16C34.2233 291.867 25.41 288.71 17.81 282.69C6.69 273.87 0.753333 262.203 0 247.69C0 228.69 0 209.69 0 190.69C0.846667 175.73 7.11667 163.853 18.81 155.06C26.5567 149.233 35.4533 146.317 45.5 146.31C78.2467 146.27 110.997 146.25 143.75 146.25C162.523 146.25 178.273 146.097 191 145.79C198.513 145.61 205.163 145.22 210.95 144.62C237.417 141.873 263.177 135.9 288.23 126.7C318.33 115.647 346.867 101.45 373.84 84.11C396.26 69.6967 417.707 53.9534 438.18 36.88C438.43 36.67 438.74 36.56 439.06 36.56C443.48 36.5334 447.19 37.1167 450.19 38.31C463.37 43.5567 471.407 52.4833 474.3 65.09C475.1 68.57 475.5 75.2067 475.5 85C475.5 117.06 475.5 149.383 475.5 181.97C475.5 182.4 475.84 182.75 476.27 182.76C483.837 182.92 490.697 185.31 496.85 189.93C506.25 196.983 511.3 206.443 512 218.31ZM257.15 264.46C285.737 271.127 313.25 280.827 339.69 293.56C369.877 308.107 399.43 326.133 428.35 347.64C431.603 350.067 434.913 352.407 438.28 354.66C438.553 354.847 438.69 354.773 438.69 354.44L438.75 83.38C438.75 82.8133 438.527 82.7034 438.08 83.05C415.247 100.65 391.307 116.573 366.26 130.82C341.633 144.827 315.88 156.307 289 165.26C266.553 172.74 243.573 177.823 220.06 180.51C219.78 180.54 219.56 180.78 219.56 181.06L219.5 257.34C219.5 257.66 219.74 257.93 220.06 257.97C232.467 259.43 244.83 261.593 257.15 264.46Z" fill="black"/>
  </svg>
`;

  const closeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
`;

  const heading = 'Help Support Discogs Enhancer';

  const mainMessage = 'Your kind donation can help cover the <b>$86.40</b> yearly server costs and support the thousands of hours put into its development. Every little bit counts, and I appreciate your generosity!';

  const disclaimer = 'This message is shown once a year';

  const url = '';

  const modal = `
    <div class="de-donate-modal animate-bottom">
      <div class="inner">
        <div class="header">
          <span class="bullhorn-icon">${bullhornIcon}</span>
          <h3>${heading}</h3>
        </div>
        <div class="text">
          <p class="support-text">${mainMessage}</p>
          <p class="disclaimer">${disclaimer}</p>
          <a class="donate-btn" href="${url}" target="_blank" rel="nofollow noopener">Support Discogs Enhancer</a>
        </div>
        <button class="close-btn">${closeIcon}</button>
      </div>
    </div>
`;

  // ========================================================
  // CSS
  // ========================================================

  const styles = /*css*/`
    .de-donate-modal {
      display: none;
      background: white;
      bottom: 20px;
      box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      font-family: Nunito Sans,-apple-system,San Francisco,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Helvetica,Arial,sans-serif !important;
      left: 20px;
      padding: 1rem 1rem 2rem 1rem;
      position: fixed;
      width: 400px;
      z-index: 1000;
    }

    .de-donate-modal .header {
      align-items: center;
      display: flex;
    }

    .de-donate-modal .header h3 {
      font-size: 16px;
      margin: 0;
      margin-left: 1rem;
    }

    .de-donate-modal .header .bullhorn-icon {
      height: 24px;
      width: 24px;
    }

    .de-donate-modal .header .bullhorn-icon svg path {
      fill: #306697;
    }

    .de-donate-modal .inner {
      position: relative;
    }

    .de-donate-modal .inner .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      position: absolute;
      right: -10px;
      top: 0;
    }

    .de-donate-modal .inner .close-btn svg {
      height: 16px;
      stroke: #858379;
      width: 16px;
    }

    .de-donate-modal .text {
      margin-left: 2.7rem;
    }

    .de-donate-modal .support-text {
      font-size: 14px;
      line-height: 1.5;
      margin-right: 1rem;
      margin-top: .5rem;
    }

    .de-donate-modal .disclaimer {
      color: gray;
      font-size: 12px;
      margin-bottom: 1.5rem;
    }

    .de-donate-modal .donate-btn {
      background: black;
      border-radius: 4px;
      border: none;
      color: white;
      font-size: 14px;
      padding: .5rem 1rem;
    }

    .de-donate-modal .donate-btn:hover {
      background: #60c43f;
      color: white;
      text-decoration: none;
    }

    body[class*="_light"] .de-donate-modal h3 {
      margin-left: 1.15rem;
    }

    .animate-bottom {
      animation: animatebottom 0.4s
    }

    @keyframes animatebottom {
        from {
            bottom: -300px;
            opacity: 0
        }

        to {
            bottom: 0;
            opacity: 1
        }
    }
`;

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Get the approximate dates for the summer and winter solstices in a given year.
   * @param {number} year - The year for which solstice dates are needed.
   * @returns {{summerSolstice: Date, winterSolstice: Date}} An object containing the summer and winter solstice dates.
   */
  function getSolsticeDates(year) {
    const summerSolstice = new Date(year, 5, 20); // June 20th
    const winterSolstice = new Date(year, 11, 21); // December 21st
    return { summerSolstice, winterSolstice };
  }

  /**
   * Check if the given date is within 7 days of the solstice date, including the solstice itself.
   * @param {Date} today - The date to check.
   * @param {Date} solstice - The solstice date.
   * @returns {boolean} Returns true if the date is within 7 days of the solstice date.
  */
  function isDateOnOrAfterSolstice(today, solstice) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const differenceInDays = (today - solstice) / msPerDay;

    return differenceInDays >= -7 && differenceInDays <= 0;
  }

  /**
   * Get the upcoming solstice date based on the given date.
   * @param {Date} today - The date for which the upcoming solstice is needed.
   * @returns {Date} The upcoming solstice date.
   */
  function getUpcomingSolstice(today) {
    const solstices = getSolsticeDates(today.getFullYear());
    if (isDateOnOrAfterSolstice(today, solstices.summerSolstice)) {
      return solstices.winterSolstice;
    } else {
      return solstices.summerSolstice;
    }
  }

  /**
   * Show the modal and set the event listener for the close button.
   */
  function showModal() {
    const modal = document.querySelector('.de-donate-modal');
    const closeBtn = document.querySelector('.de-donate-modal .close-btn');

    modal.style.display = 'block';

    closeBtn.onclick = function () {
      modal.style.display = 'none';
      localStorage.setItem('donateModalDismissed', JSON.stringify({ year: new Date().getFullYear(), solstice: getUpcomingSolstice(new Date()).getTime() }));
    };
  }

  /**
   * Check if the modal should be shown based on the date
   * and dismissal information, and show it if necessary.
   */
  function checkDateAndShowModal() {
    const today = new Date();
    const solstices = getSolsticeDates(today.getFullYear());
    const isOnOrAfterSummerSolstice = isDateOnOrAfterSolstice(today, solstices.summerSolstice);
    // const isOnOrAfterWinterSolstice = isDateOnOrAfterSolstice(today, solstices.winterSolstice);
    const dismissedData = localStorage.getItem('donateModalDismissed');
    const dismissed = dismissedData && JSON.parse(dismissedData);

    if (isOnOrAfterSummerSolstice && (!dismissed || dismissed.year !== today.getFullYear() || dismissed.solstice !== getUpcomingSolstice(today).getTime())) {
      setTimeout(() => {
        showModal();
      }, 1500);
    }
  }

  // ========================================================
  // DOM Setup
  // ========================================================

  rl.attachCss('donate-styles', styles);
  document.body.insertAdjacentHTML('beforeend', modal);

  if (!window.location.href.includes('support.discogs.com')) {
    checkDateAndShowModal();
  }
});

