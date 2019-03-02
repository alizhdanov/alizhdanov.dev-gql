const { objectType } = require('nexus');
const fetch = require('node-fetch');

const Image = objectType({
  name: 'Image',
  definition(t) {
    t.int('width');
    t.int('height');
    t.string('url');
  },
});

const Images = objectType({
  name: 'Images',
  definition(t) {
    t.field('thumbnail', { type: Image });
    t.field('lowResolution', { type: Image, resolve: i => i.low_resolution });
    t.field('standartResolution', {
      type: Image,
      resolve: i => i.standard_resolution,
    });
  },
});

const InstagramItem = objectType({
  name: 'InstagramItem',
  definition(t) {
    t.id('id');
    t.int('likes', i => i.likes.count);
    t.int('comments', i => i.comments.count);
    t.string('link');
    t.string('filter');
    t.field('images', {
      type: Images,
    });
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.list.field('instagram', {
      type: InstagramItem,
      resolve: async () => {
        const response = await fetch(
          `https://api.instagram.com/v1/users/self/media/recent?access_token=${
            process.env.INSTAGRAM_TOKEN
          }`
        );

        const { data } = await response.json();

        return data;
      },
    });
  },
});

module.exports = { Query, InstagramItem, Images, Image };
