module.exports = {
  eleventyComputed: {
    // /writing was last modified when the newest post was published
    date: (data) => data.collections.writingLatestFirst?.[0]?.date,
  },
}
