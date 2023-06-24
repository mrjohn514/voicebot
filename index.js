if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { error } = require('console')
const express = require('express')
const app = express()
const http = require('http').createServer(app)

// Pass the 'http' server object to the socket.io function to create the 'io' object.
const io = require('socket.io')(http)

const port = process.env.PORT || 3000
const { Configuration, OpenAIApi } = require('openai')

app.use(express.static(__dirname + '/public'))

const openai = new OpenAIApi(
  new Configuration({
    apiKey: `${process.env.SECRET_KEY}`,
  })
)

io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('speech-to-text', (data) => {
    openai
      .createCompletion({
        model: 'text-davinci-003',
        prompt: data,
        max_tokens: 500,
      })
      .then((responce) => {
        console.log(responce.data)
        const tos = responce.data.choices[0].text
        // console.log('tos is', tos)
        io.emit('text-to-speech', tos)
      })
      .catch((error) => {
        console.log(error)
      })
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})

http.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
