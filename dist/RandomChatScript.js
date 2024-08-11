const chatRandomSocket = io('/chatRandom');

const username = prompt('Write a name to join?');
const messagesContainer = document.getElementById('messages-container');
const WaitingConnStatus = document.getElementById('WaitingConnStatus');
const notification = new Audio('/notification.mp3')
const form = document.getElementById('form')
const nextbtn = document.getElementById('nextBtn')
let typing_user_name = ''

chatRandomSocket.emit('new-user', username)
chatRandomSocket.on('user-matched', (name_random) => {
    messagesContainer.innerHTML="";
    const joinMessage = document.createElement('div');
  joinMessage.className = 'text-center my-3';
  joinMessage.innerHTML = `<span class="text-center p-1 rounded-[10px] font-bold text-white bg-blue-500">${name_random} has been connected to you</span>`;
  messagesContainer.appendChild(joinMessage);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  notification.play()
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
  }
})

chatRandomSocket.on('user-ready-to-connect', () => {
  messagesContainer.innerHTML = '<div id="WaitingConnStatus" class="text-center text-gray-500 mb-4">Waiting for connection...</div>'
})
let typing = false;
let timeout = null;

function typingStatus(isTyping) {
  chatRandomSocket.emit('typing-status', { isTyping, user_name: username });
}



chatRandomSocket.on('show-typing-status', (data) => {
  
  typingStatusBox.textContent = `${data.user_name} is typing...`;
  // if (data.isTyping && data.user_name !== username) {
  //   // typingStatusBox.textContent = `${data.user_name} is typing...`;
  //   // if (!document.body.contains(typingStatusBox)) {
  //   //   messagesContainer.appendChild(typingStatusBox);
  //   //   messagesContainer.scrollTop = messagesContainer.scrollHeight;
  //   // }
  // } else {
  //   notification.play()

  //   clearTimeout(timeout);
  //   timeout = setTimeout(() => {
  //     typingStatusBox.textContent = '';
  //     if (document.body.contains(typingStatusBox)) {
  //       typingStatusBox.remove();
  //     }
  //   }, 1000);
  // }
});

document.getElementById('text').addEventListener('input', () => {
  if (document.getElementById('text').value.length > 0) {
    typingStatus(true);
  } else {
    typingStatus(false);
  }
});

chatRandomSocket.on('user-disconnected', (disconnected_random) => {
    alert(`${disconnected_random} has disconnected`)
    messagesContainer.innerHTML = '<div id="WaitingConnStatus" class="text-center text-gray-500 mb-4">Waiting for connection...</div>'
})