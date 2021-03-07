const express = require('express')
const nunjucks = require('nunjucks')

const app = express()
const port = process.env.PORT || 3000
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

app.get('/writing', (req, res) => {
  res.redirect('https://lswainemoore.github.io')
})

app.get('/doodling', (req, res) => {
  res.render('doodling.html')
})

app.get('/having-fun-with-favicons', (req, res) => {
  res.render('funicons.html')
})

app.get('/reading', (req, res) => {
  res.render('reading.html')
})

app.get('*', function(req, res) {
  res.redirect('/')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
