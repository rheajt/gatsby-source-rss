# gatsby-source-rss

Fork of the `gatsby-source-rss` plugin to allow for custom RSS fields.

## Usage

Add the following to your `gatsby-config.js`

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-rss',
      options: {
        rssURL: 'https://blog.jordanrhea.com/rss.xml',
        customFields: {
          item: ['tags'],
        },
      },
    },
  ],
};
```

Then, grab the data in graphql:

```js
allRssFeedItem {
  edges {
    node {
      id
      youtube
      tags
      title
      content
      link
    }
  }
}
```
