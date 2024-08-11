# 🔗 Socket-Based Chat Application

Welcome to the **Socket-Based Chat Application**! This project is designed to connect users randomly and allow them to chat with each other. It handles user connections, disconnections, and notifies users when their match disconnects. 

## 🛠 Features

- 🚀 **Random User Matching**: Connects users randomly for a chat session.
- 🔄 **Connection Management**: Tracks user connections and disconnections.
- 🛑 **Disconnection Handling**: Notifies the remaining user when their match disconnects.
- 🙌**Typing Indicators**: Show when a user is typing.
- 🗣 **Two Chat Modes**:
  - **Chat Room**: Standard chat room experience where multiple users can join.
  - **Chat Random**: Randomly matches users for one-on-one chats.

## 📁 Project Structure

- **`randomScript.js`**: Main script handling the socket connections and user matching logic.
- **`findMatch()`**: Function to find and connect users in the `chatRandom` namespace.
- **Namespaces**:
  - **`chatRoom`**: For standard chatroom experience.
  - **`chatRandom`**: For random user matching.

## 👨‍💻 Usage

   - **chatRoom**: Join a common room to chat with multiple users.
   - **chatRandom**: Get randomly matched with another user for a private chat.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
## 🤝 Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.
