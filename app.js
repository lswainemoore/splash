const express = require('express')

const app = express()
const port = 3000
app.engine('html', require('ejs').renderFile)

app.use(express.static('public'))


app.get('/blue', (req, res) => {
  res.render('splash.html')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
