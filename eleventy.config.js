const markdownIt = require('markdown-it')
const markdownItFootnote = require('markdown-it-footnote')

module.exports = function (eleventyConfig) {
  // same markdown pipeline the old express app used
  eleventyConfig.setLibrary('md', markdownIt().use(markdownItFootnote))

  // YYYY-MM-DD from UTC components, so output matches the frontmatter date
  // regardless of the build machine's timezone
  eleventyConfig.addFilter('dateStr', (date) => {
    return `${date.getUTCFullYear()}-${("0" + (date.getUTCMonth() + 1)).slice(-2)}-${("0" + date.getUTCDate()).slice(-2)}`
  })

  // page.url keeps the .html extension for flat permalinks; links should not
  eleventyConfig.addFilter('cleanUrl', (url) =>
    url === '/index.html' ? '/' : url.replace(/\.html$/, '')
  )

  // posts newest-first, for the /writing index
  eleventyConfig.addCollection('writingLatestFirst', (api) =>
    api.getFilteredByGlob('site/writing/*.md').sort((i, j) => (i.date < j.date ? 1 : -1))
  )

  // posts in filename order (the old readdir order), for sitemap.xml and _redirects
  eleventyConfig.addCollection('writingBySlug', (api) =>
    api.getFilteredByGlob('site/writing/*.md').sort((i, j) => (i.page.fileSlug < j.page.fileSlug ? -1 : 1))
  )

  // public/ was served at the site root; /bragging.pdf is an alias for the resume
  eleventyConfig.addPassthroughCopy({ public: '/' })
  eleventyConfig.addPassthroughCopy({ 'public/pdf/resume.pdf': 'bragging.pdf' })

  return {
    dir: {
      input: 'site',
      output: 'dist',
    },
    // templates are nunjucks; markdown posts are pure markdown (no preprocessing)
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: false,
  }
}
