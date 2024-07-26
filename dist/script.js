const socket = io();
const username = prompt('What is your name?', 'Guest');
const messagesContainer = document.getElementById('messages-container');
const form = document.getElementById('form')
const notification = new Audio('/notification.mp3')

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
    socket.emit('send', text)
})


socket.emit('new-user', username);
socket.on('user-joined', (name) => {
    const joinMessage = document.createElement('div');
    joinMessage.className = 'text-center my-3';
    joinMessage.innerHTML = `<span class="text-center p-1 rounded-[10px] font-bold text-white bg-blue-500">${name} joined the chat</span>`;
    messagesContainer.appendChild(joinMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

socket.on('recieve', (data) => {
    const messageBox = document.createElement('div')
    messageBox.className = 'flex justify-start mb-4'
    messageBox.innerHTML = `<div class="bg-blue-500 p-4 text-white rounded-lg shadow-md max-w-md">
          <div class="font-bold text-lg">${data.user}</div>
          <div class="text-base mt-2">${data.message}</div>
          <div class="text-sm text-gray-200 mt-2 text-right">${new Date().toLocaleTimeString()}</div>
        </div>`
    messagesContainer.appendChild(messageBox)
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    notification.play()
})