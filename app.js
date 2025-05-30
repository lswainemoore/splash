const express = require('express')
const nunjucks = require('nunjucks')

const app = express()
const port = process.env.PORT || 3001
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

const domain = 'lincoln.swaine-moore.is'


app.use(express.static('public'))


app.get('/', (req, res) => {
  res.render('splash.html', {canonical_url: `https://${domain}/`})
})

app.get('/blue', (req, res) => {
  res.render('splash.html', {canonical_url: `https://${domain}/`})
})

app.get('/talking-about-himself', (req, res) => {
  res.render('about.html')
})

app.get('/doodling', (req, res) => {
  res.render('doodling.html')
})

app.get('/having-fun-with-favicons', (req, res) => {
  res.render('funicons.html')
})

app.get('/finding-coordinates', (req, res) => {
  res.render('coordinates.html')
})

const books = []
const loadBooks = async () => {
  const flagsToEmoji = {
    'a': '🔈',
    'r': '🔁',
    'b': '📖',
  }
  const fs = require("fs");
  const { parse } = require("csv-parse");
  fs.createReadStream("./data/reading.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      row.push([])
      row[3].split('').forEach((flag) => {
        row[4].push(flagsToEmoji[flag])
      })
      // row[4] = row[4].join('')
      books.push(row)
    })
}
loadBooks()

app.get('/reading', (req, res) => {
  res.render('reading.html', {books: books})
})

app.get('/connecting-4', (req, res) => {
  res.render('connect4.html')
})

app.get('/bragging', (req, res) => {
  res.render('resume.html')
})

app.get('/bragging.pdf', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf')
  res.sendFile(`${__dirname}/public/pdf/resume.pdf`)
})

// BLOG

// adapted from: https://dev.to/khalby786/creating-a-markdown-blog-with-ejs-express-j40

var formatDateStr = (date) => {
  // adapted from: https://stackoverflow.com/a/30272803
  return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate() + 1)).slice(-2)}`
}

app.get('/writing-about/:slug', (req, res) => {
  const post = allPosts[req.params.slug]

  if (!post) {
    return res.redirect('/writing')
  }

  // if this has a redirect url, go there instead!
  if (post.redirect) {
    // i'm never sure if this should be 301 or 302,
    // but i guess it's permanent so 301?
    return res.redirect(301, post.redirect)
  }

  res.render('post.html', {post: post, canonical_url: `https://${domain}/writing-about/${post.slug}`})
})
app.get('/writing', (req, res) => {
  // order posts by date
  const posts = Object.values(allPosts).sort((i, j) => {
    return i.date < j.date ? 1 : -1;
  })
  res.render('writing.html', {
    posts: posts
  })
})

// preload blog data
var allPosts = {};  // map from slug -> data
var loadWritingData = () => {
  const gm = require('gray-matter');  // parsing markdown
  const fs = require('fs');
  var md = require('markdown-it')().use(require('markdown-it-footnote'));
  const postFiles = fs.readdirSync(`${__dirname}/writing`)
                  .filter(f => f.endsWith('.md'))
  postFiles.forEach((postFile) => {
    file = gm.read(`${__dirname}/writing/${postFile}`)
    let slug = postFile.slice(0, -3);
    allPosts[slug] = {
      slug: slug,
      content: md.render(file.content),
      title: file.data.title,
      date: file.data.date,
      dateStr: formatDateStr(file.data.date),
      redirect: file.data.redirect,
    }
  })
}
loadWritingData()

// end BLOG

app.get('/redirecting/to/working-copy', function(req, res) {
  console.log(req.headers)
  console.log(req.query)
  console.log(req.originalUrl)
  const repo = req.query.repo
  const path = req.query.path
  const url = `working-copy://open?repo=${repo}&path=${path}`
  res.send(`
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="1; url='${url}'" />
  </head>
  <body>
    <p>You will be redirected to ${url} now.</p>
  </body>
</html>
  `)
})

// Sitemap generation
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = `https://${domain}`
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add static routes
  const staticRoutes = [
    { path: '/', lastmod: '2022-12-10', priority: '1.0' },
    { path: '/talking-about-himself', lastmod: '2025-05-27', priority: '1.0' },
    { path: '/doodling', lastmod: '2021-04-03', priority: '0.4' },
    { path: '/having-fun-with-favicons', lastmod: '2021-04-03', priority: '0.6' },
    { path: '/reading', lastmod: '2025-05-27', priority: '0.6' },
    { path: '/bragging', lastmod: '2025-05-27', priority: '1.0' },
    { path: '/writing', lastmod: '2025-05-27', priority: '1.0' }
  ];
  
  staticRoutes.forEach(route => {
    sitemap += `  <url>\n    <loc>${baseUrl}${route.path}</loc>\n    <lastmod>${route.lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
  });
  
  // Add blog posts
  Object.values(allPosts).forEach(post => {
    sitemap += `  <url>\n    <loc>${baseUrl}/writing-about/${post.slug}</loc>\n    <lastmod>${post.dateStr}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });
  
  sitemap += '</urlset>';
  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

// catch-all
app.get('*', function(req, res) {
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Listening at ${port}`)
})
