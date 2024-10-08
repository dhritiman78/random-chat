const chatRandomSocket = io('/chatRandom');

const username = prompt('Write a name to join?');
const messagesContainer = document.getElementById('messages-container');
const WaitingConnStatus = document.getElementById('WaitingConnStatus');
const notification = new Audio('/notification.mp3')
const form = document.getElementById('form')
const nextbtn = document.getElementById('nextBtn')

chatRandomSocket.emit('new-user', username)
chatRandomSocket.on('user-matched', (name_random) => {
    messagesContainer.innerHTML="";
    const joinMessage = document.createElement('div');
  joinMessage.className = 'text-center my-3';
  joinMessage.innerHTML = `<span class="text-center p-1 rounded-[10px] font-bold text-white bg-blue-500">${name_random} has been connected to you</span>`;
  messagesContainer.appendChild(joinMessage);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  notification.play()
  nextbtn.classList.remove('bg-blue-200')
  nextbtn.classList.add('bg-blue-500')
  nextbtn.disabled = false;
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const textElement = document.getElementById('text')
  const text = textElement.value
  const messageBox = document.createElement('div')
  messageBox.className = 'flex justify-end mb-4'
  messageBox.innerHTML = `<div class="bg-white p-4 rounded-lg shadow-md max-w-md">
        <div class="font-bold text-lg text-blue-500">You</div>
        <div class="text-base mt-2">${text}</div>
        <div class="text-sm text-gray-400 mt-2 text-right">${new Date().toLocaleTimeString()}</div>
      </div>`
  messagesContainer.appendChild(messageBox)
  textElement.value = ''
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  chatRandomSocket.emit('send-text', text)
  typingStatus(false);
})

chatRandomSocket.on('recieved-text', (recieved_data) => {
  const messageBox = document.createElement('div')
  messageBox.className = 'flex justify-start mb-4'
  messageBox.innerHTML = `<div class="bg-blue-500 p-4 text-white rounded-lg shadow-md max-w-md">
        <div class="font-bold text-lg">${recieved_data.user}</div>
        <div class="text-base mt-2">${recieved_data.message}</div>
        <div class="text-sm text-gray-200 mt-2 text-right">${new Date().toLocaleTimeString()}</div>
      </div>`
  messagesContainer.appendChild(messageBox)
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  notification.play()
})


nextbtn.addEventListener('click', () => {
  if (confirm('Are you sure?')) {
    chatRandomSocket.emit('user-next')
    nextbtn.classList.remove('bg-blue-500')
    nextbtn.classList.add('bg-blue-200')
    nextbtn.disabled = true;
  }
})

chatRandomSocket.on('user-ready-to-connect', () => {
  messagesContainer.innerHTML = '<div id="WaitingConnStatus" class="text-center text-gray-500 mb-4">Waiting for connection...</div>'
})

chatRandomSocket.on('user-disconnected', (disconnected_random) => {
    alert(`${disconnected_random} has disconnected`)
    messagesContainer.innerHTML = '<div id="WaitingConnStatus" class="text-center text-gray-500 mb-4">Waiting for connection...</div>'
    nextbtn.classList.remove('bg-blue-500')
    nextbtn.classList.add('bg-blue-200')
    nextbtn.disabled = true;
})
// Typing Status
let typing = false;
let timeout = null;
let typingStatusBox = document.createElement('div');
typingStatusBox.className = 'p-2 text-gray-500 text-sm text-center typing-status';
chatRandomSocket.on('show-typing', (data) => {
if (data.isTyping) {
  showTyping(data)
} else {
  setTimeout(() => {
    typingStatusBox.innerHTML = ''
    typingStatusBox.remove()
  },1000)
}
})
function typingStatus(value) {
    chatRandomSocket.emit('user-typing', value)
}
function showTyping(data) {
typingStatusBox.innerHTML = `${data.user_name} is typing...`;
messagesContainer.appendChild(typingStatusBox);
messagesContainer.scrollTop = messagesContainer.scrollHeight;
}