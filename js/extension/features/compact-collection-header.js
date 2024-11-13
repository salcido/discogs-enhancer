
rl.ready(() => {

  if ( rl.pageIs('collection') ) {

    let rules = /*css*/`
        #collection-stats {
          display: flex;
          margin-top: .5rem;
        }
        #collection-stats header {
          margin-right: 2rem;
        }

        [class*="content_"] {
          margin-top: 1rem;
        }
        [class*="itemTitle_"] {
          font-size: .875rem;
        }
        [class*="itemData_"] {
          line-height: 16px;
        }
        [class*="viewAndShow_"]{
          width: 250px !important;
        }
        [class*="horizontalLinks_"] ul {
          padding: 0 .5rem;
        }

        [class*="format_item_"],
        [class*="released_"],
        [class*="folderActionBtn_"],
        [class*="markup_"],
        .MuiSelect-select,
        .MuiTypography-labelSmall,
        .MuiDataGrid-cell--withRenderer,
        .MuiDataGrid-cellContent {
          font-size: 13px !important;
        }
    `;
    rl.attachCss('collection-page', rules);

    let collectionItems = 'div[class*="MuiDataGrid-cell--withRenderer"]';

    rl.waitForElement(collectionItems).then(() => {

      setTimeout(() => {
        let layoutBtns = document.querySelector('div[class*="viewAndShow_"]'),
            bulkActionsRow = document.querySelector('[class*="collectionControls_"]');

        // Don't run when viewing someone else's collection
        if (!bulkActionsRow) return;
        // Relocate Layout buttons
        bulkActionsRow.insertAdjacentElement('beforeend', layoutBtns);
        document.querySelector('[class*="pagerAndViewContainer_"]').style.display = 'none';

        let manageBtns = document.querySelector('div[class*="pageHeadLinks_"]'),
            navButtons = document.querySelector('nav[class*="horizontalLinks_"]');

        // Relocate Manage / Export links
        navButtons.insertAdjacentElement('beforeend', manageBtns);
        document.querySelector('[class*="pageNameAndLinks_"]').style.display = 'none';
      }, 100);
    });
  }
});

