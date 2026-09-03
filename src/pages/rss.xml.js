import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('news', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: 'OverPower News',
    description: 'Announcements, rulings, event reports and design notes from the OverPower team.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: [post.data.category, ...post.data.tags],
      // Posts live at the site root, matching their WordPress URLs.
      link: `/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
