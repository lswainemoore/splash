const express = require('express')
const nunjucks = require('nunjucks')

const app = express()
const port = process.env.PORT || 3001
nunjucks.configure('views', {
    autoescape: true,
    express: app
});


app.use(express.static('public'))


app.get('/', (req, res) => {
  res.redirect('/blue')
})

app.get('/blue', (req, res) => {
  res.render('splash.html')
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
      row[4] = row[4].join('/')
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

  res.render('post.html', {post: post})
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
  var md = require('markdown-it')()
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

// catch-all
app.get('*', function(req, res) {
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Listening at ${port}`)
})
