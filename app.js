const express = require('express')

const app = express()
const port = process.env.PORT || 3000
app.engine('html', require('ejs').renderFile)

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

app.get('/reading', (req, res) => {
  res.render('reading.html')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
