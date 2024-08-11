const chatRandomSocket = io('/chatRandom');

const username = prompt('Write a name to join?');
const messagesContainer = document.getElementById('messages-container');
const WaitingConnStatus = document.getElementById('WaitingConnStatus');

chatRandomSocket.emit('new-user', username)
chatRandomSocket.on('user-matched', (name_random) => {
    WaitingConnStatus.innerHTML="";
    const joinMessage = document.createElement('div');
  joinMessage.className = 'text-center my-3';
  joinMessage.innerHTML = `<span class="text-center p-1 rounded-[10px] font-bold text-white bg-blue-500">${name_random} has been connected to you</span>`;
  messagesContainer.appendChild(joinMessage);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
})
chatRandomSocket.on('user-disconnected', (disconnected_random) => {
    alert(`${disconnected_random} has disconnected`)
})