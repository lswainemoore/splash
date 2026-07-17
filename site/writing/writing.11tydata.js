module.exports = {
  layout: 'post.html',
  eleventyComputed: {
    // posts with a `redirect` in their frontmatter don't get a page;
    // they become entries in _redirects instead (see _redirects.njk)
    permalink: (data) =>
      data.redirect ? false : `/writing-about/${data.page.fileSlug}.html`,
    canonical_url: (data) =>
      data.redirect ? '' : `https://lincoln.swaine-moore.is/writing-about/${data.page.fileSlug}`,
  },
}
