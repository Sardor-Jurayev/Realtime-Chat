const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')

// Getting  the username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

console.log(username, room)

const socket = io()

// Join a room
socket.emit('joinRoom', { username, room})

// Message from server
socket.on('message', message => {
  console.log(message)
  outputMessage(message)

// Scroll down on message
chatMessage.scrollTop = chatMessage.scrollHeight
})

// Submits message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  //Get message text
  const msg = e.target.elements.msg.value
  // Emit message to server
  socket.emit('chatMessage', msg)

  // Clear input
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

// output message to DOM

function outputMessage(message){
  const div = document.createElement('div')
  div.classList.add('message');
  div.innerHTML = `
  <p class="meta"> ${message.username}<span>kl ${message.time}</span></p>
  <p class="text">${message.text}</p>
`
  document.querySelector('.chat-messages').appendChild(div)
}