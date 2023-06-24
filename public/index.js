const socket = io()
const speakButton = document.getElementById('speak-button')
const stopButton = document.getElementById('stop-button')

// Initialize Web Speech API
const recognition = new window.webkitSpeechRecognition()
recognition.lang = 'en-US'
recognition.interimResults = false
recognition.maxAlternatives = 1

// Update query input with transcribed text
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript

  // Send the transcript to your server using Socket.IO
  socket.emit('speech-to-text', transcript)
}

socket.on('text-to-speech', (data) => {
  console.log('enterd', data)

  const utterance = new SpeechSynthesisUtterance(data)
  window.speechSynthesis.speak(utterance)
})

// Start speech recognition when speak button is clicked
speakButton.addEventListener('click', () => {
  recognition.start()
})

stopButton.addEventListener('click', () => {
  window.speechSynthesis.cancel()
})
