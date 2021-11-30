const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
// Getting  the username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

console.log(username, room)

const socket = io()

// Join a room
socket.emit('joinRoom', { username, room})

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outpotUesers(users);
})

// Add room name to DOM

function outputRoomName(room) {
  roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users){
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

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
  <p class="meta"> ${message.username} <span> kl ${message.time}</span></p>
  <p class="text">${message.text}</p>
`
  document.querySelector('.chat-messages').appendChild(div)
}

