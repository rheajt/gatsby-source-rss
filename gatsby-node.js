const Parser = require('rss-parser');
const crypto = require('crypto');

const createContentDigest = obj => crypto
  .createHash('md5')
  .update(JSON.stringify(obj))
  .digest('hex');

function promisifiedParseURL(url, customFields) {
  // console.log(customFields);
  const parser = new Parser({
    customFields,
  });
  return new Promise((resolve, reject) => {
    parser.parseURL(url, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

const createChildren = (items, parentId, createNode) => {
  const childIds = [];
  items.forEach((entry) => {
    childIds.push(entry.link);
    const node = {
      ...entry,
      id: entry.link,
      title: entry.title,
      link: entry.link,
      description: entry.description,
      parent: parentId,
      children: [],
    };

    node.internal = {
      type: 'rssFeedItem',
      contentDigest: createContentDigest(node),
    };
    createNode(node);
  });
  return childIds;
};

async function sourceNodes({ actions }, { rssURL, customFields }) {
  const { createNode } = actions;
  const data = await promisifiedParseURL(rssURL, customFields);
  if (!data) {
    return;
  }
  const {
    title, description, link, items,
  } = data;

  const childrenIds = createChildren(items, link, createNode);
  const feedStory = {
    id: link,
    title,
    description,
    link,
    parent: null,
    children: childrenIds,
  };

  feedStory.internal = { type: 'rssFeed', contentDigest: createContentDigest(feedStory) };

  createNode(feedStory);
}

exports.sourceNodes = sourceNodes;
