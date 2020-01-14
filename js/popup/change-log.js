module.exports = {
  current: [
    {
      version: '2.19.0',
      features: [],
      updates: [],
      thanks: [
        'Thank you to <a href="https://www.discogs.com/user/Mark_Anthony">Mark_Anthony</a> for his generous donation!'
      ]
    },
  ],
  previous: [
    {
      version: '2.18.2',
      features: [],
      updates: [
        {
          name: 'Enhancement',
          description: 'Text Format Shortcuts has a new look - no more garish buttons!'
        },
        {
          name: 'Enhancement',
          description: 'A few small Dark Theme fixes - .highlight class color rule, dashboard module header fix, and GDPR cookie consent styles.'
        },
      ],
      thanks: [
      ]
    },
    {
      version: '2.18.1',
      features: [],
      updates: [
        {
          name: 'Feature Removal',
          description: 'The "beta" collection app has been removed from Discogs so I\'ve updated the extension to remove the Collection Links In New Tabs feature as well as (hopefully) all references to the "beta" collection.'
        }
      ],
      thanks: [
        'Thank you to sdsowlsa and Roman G. for buying me a coffee!'
      ]
    },
    {
      version: '2.18.0',
      features: [
        {
          name: 'Confirm Before Removing Items',
          description: 'Asks you to confirm that you want to remove an item from your Collection when clicking "Remove" on a Release page.',
          link: '#confirm-before-removing'
        },
      ],
      updates: [
        {
          name: 'Enhancement',
          description: 'Made the dropshadow color darker on inbox messages when using the Dark Theme.'
        },
        {
          name: 'Enhancement',
          description: 'Disabled images will be more visible in the Release History when using the Dark Theme.'
        },
      ],
      thanks: [
        'Thank you to Transferwise for buying me a coffee!'
      ]
    },
    {
      version: '2.17.1',
      features: [],
      updates: [
        {
          name: 'Enhancement',
          description: 'Fixed an issue where Collection Links In New Tabs did not always open links in new tabs.'
        },
      ],
      thanks: [
        'Thanks again to <span class="mint">nmussy</span> for opening up some issues on GitHub!'
      ]
    },
    {
      version: '2.17.0',
      features: [
        {
          name: 'Filter Unavailable Items',
          description: 'Hide all items in the Marketplace if they are unavailable in your country.',
          link: '#filter-unavailable'
        },
      ],
      updates: [
        {
          name: 'Enhancement',
          description: 'Random Item Button has a new icon and you can now right-click on it and open the random page in a new tab/window!'
        },
      ],
      thanks: [
        'Thanks again to <span class="mint">nmussy</span> for opening up some issues on GitHub!'
      ]
    },
    {
      version: '2.16.0',
      features: [
        {
          name: 'Show Relative Last Sold Dates',
          description: 'See the relative time an item was last sold on the Release page.',
          link: '#relative-sold-date'
        },
      ],
      updates: [
        {
          name: 'Enhancement',
          description: 'Functional testing with Travis CI and Puppeteer! This means Discogs Enhancer will ship with less bugs!'
        },
        {
          name: 'Enhancement',
          description: 'Extension support for Korean language.'
        },
        {
          name: 'Enhancement',
          description: 'Fixed an issue where hidden sellers were not actually hidden on previous/next page clicks.'
        },
        {
          name: 'Bug fix',
          description: 'Fixed an issue where block buyer shortcuts would not correctly parse some usernames.'
        },
      ],
      thanks: [
      ]
    },
    {
      version: '2.15.0',
      features: [
        {
          name: 'Block Buyer Shortcuts',
          description: 'Adds a "Block Buyer" button to the order invoice page that allows you to block the buyer directly.',
          link: '#blockBuyers'
        },
      ],
      updates: [
        {
          name: 'Show Actual Dates',
          description: 'Show Actual Dates will now only show the relative date when you mouseover it (no more clicking to see it).'
        },
        {
          name: 'Suggested Prices',
          description: 'Suggested Prices will handle server errors better now.'
        },
        {
          name: 'Show Actual Dates',
          description: 'Show Actual Dates will now show the relative date when you mouse over it (no more clicking)'
        },
        {
          name: 'Bug Fix',
          description: 'Page loads in the Marketplace should be faster if you are NOT using Everlasting Marketplace.'
        },
        {
          name: 'Enhancement',
          description: 'Seller icons will now show a tooltip when you mouse over them in the Marketplace.'
        },
      ],
      thanks: [
        'Thank you to <span class="mint">Andy G.</span> for his donation!',
      ]
    },
    {
      version: '2.14.0',
      features: [
        {
          name: 'Quick Search',
          description: 'Lets you search for the release on Google in a new tab by clicking the release\'s title.',
          link: '#quick-search'
        },
      ],
      updates: [
        {
          name: 'Show Sellers In Cart',
          description: 'Show Sellers In Cart will now check your cart every 15 minutes. This will help keep your cart counts in sync if you use this extension on multiple computers.'
        },
        {
          name: 'Enhancement',
          description: 'Buyer Feedback Notifications will now have a blue icon.'
        },
      ],
    },
    {
      version: '2.13.0',
      features: [
        {
          name: 'Tweak Discriminators',
          description: 'Allows you to tweak the way Artist/Label discriminators are displayed. Discriminators are the numbers in parentheses that appear next to artists/labels that have duplicate names.',
          link: '#tweak-discrims'
        },
        {
          name: 'List Items In New Tabs',
          description: 'Opens links in new tabs/windows when clicking on links in user lists. Helpful if you like to explore other user\'s lists and don\'t want to constantly click the back button (or you\'re prone to rabbit holing, like me, and lose track of the list you were exploring.)',
          link: '#listsInTabs'
        },
      ],
      updates: [
        {
          name: 'Enhancement',
          description: '"View Release Page" links in the Marketplace open in new tabs.'
        },
        {
          name: 'Enhancement',
          description: 'Added feature support for Russian and Brazilian Portuguese languages.'
        },
      ],
    },
    {
      version: '2.12.0',
      features: [
        {
          name: 'Show Sellers In Cart',
          description: 'Adds a shopping cart icon next to any seller\'s name in the Marketplace when you have items of theirs in your cart.',
          link: '#show-sellers-in-cart'
        },
      ],
      updates: [
        {
          name: 'Enhancement',
          description: '"Discogs" will now be the first item on the list when using Contextual Menu Searching.'
        },
        {
          name: 'Enhancement',
          description: 'Fixed an issue with horizontal scrollbars on Windows.'
        },
        {
          name: 'Enhancement',
          description: 'Fixed an issue with the currency converter\'s no results display.'
        },
      ],
    },
    {
      version: '2.11.0',
      features: [
        {
          name: 'Inventory Ratings',
          description: 'Marks an item\'s rating in red if it is above the value set in the option when viewing a seller\'s inventory.',
          link: '#inventory-ratings'
        },
      ],
      updates: [
        {
          name: 'Bug fix',
          description: 'Fixed missing icons for Seller Reputation, Blocked Sellers, and Favorite Sellers.'
        },
        {
          name: 'Bug fix',
          description: 'Fixed an issue with Blocked/Favorite sellers where seller names might be incorrectly matched.'
        },
        {
          name: 'Enhancement',
          description: 'Multiple icons can now be shown per seller.'
        },
      ],
    },
  ]
};
