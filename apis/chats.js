// Add a new chat between two users
async function addChat(accessToken, chatData) {
  console.log("addChat called with accessToken:", accessToken, "chatData:", chatData);
  try {
    const url = `${api_host}/api/chats/add`;
    console.log("Creating chat at URL:", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(chatData)
    });

    console.log("addChat response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("addChat response data:", result);
      return response.status;
    } else {
      console.warn("addChat failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in addChat:", error.message, error.stack);
    return 500;
  }
}

// Update a chat's second user
async function updateChat(accessToken, chatData) {
  console.log("updateChat called with accessToken:", accessToken, "chatData:", chatData);
  try {
    const url = `${api_host}/api/chats/update`;
    console.log("Updating chat at URL:", url);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(chatData)
    });

    console.log("updateChat response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("updateChat response data:", result);
      return response.status;
    } else {
      console.warn("updateChat failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in updateChat:", error.message, error.stack);
    return 500;
  }
}

// Delete a chat
async function deleteChat(accessToken, idChat) {
  console.log("deleteChat called with accessToken:", accessToken, "idChat:", idChat);
  try {
    const url = `${api_host}/api/chats`;
    console.log("Deleting chat at URL:", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idChat })
    });

    console.log("deleteChat response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("deleteChat response data:", result);
      return response.status;
    } else {
      console.warn("deleteChat failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in deleteChat:", error.message, error.stack);
    return 500;
  }
}

// Get all chats for a user
async function getAllChats(accessToken) {
  console.log("getAllChats called with accessToken:", accessToken);
  try {
    const url = `${api_host}/api/chats`;
    console.log("Fetching all chats from URL:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    console.log("getAllChats response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("getAllChats response data:", result);
      localStorage.setItem("chats", JSON.stringify(result));
      console.log("Stored chats in localStorage:", result);
      return response.status;
    } else {
      console.warn("getAllChats failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getAllChats:", error.message, error.stack);
    return 500;
  }
}

// Get a single chat
async function getChat(accessToken, idChat) {
  console.log("getChat called with accessToken:", accessToken, "idChat:", idChat);
  try {
    const url = `${api_host}/api/chats/view-a/${Number(idChat)}`;
    console.log("Fetching chat from URL:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    console.log("getChat response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("getChat response data:", result);
      console.log("Chat retrieved successfully:", result);
      localStorage.setItem("chat", JSON.stringify(result));
      console.log("Stored chat in localStorage:", result);
      return response.status;
    } else {
      console.warn("getChat failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getChat:", error.message, error.stack);
    return 500;
  }
}

// Register a new message in a chat
async function registerMessage(accessToken, messageData) {
  console.log("registerMessage called with accessToken:", accessToken, "messageData:", messageData);
  try {
    const url = `${api_host}/api/messages/register`;
    console.log("Registering message at URL:", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(messageData)
    });

    console.log("registerMessage response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("registerMessage response data:", result);
      return response.status;
    } else {
      console.warn("registerMessage failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in registerMessage:", error.message, error.stack);
    return 500;
  }
}

// Update a message's description
async function updateMessage(accessToken, messageData) {
  console.log("updateMessage called with accessToken:", accessToken, "messageData:", messageData);
  try {
    const url = `${api_host}/api/messages/update`;
    console.log("Updating message at URL:", url);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(messageData)
    });

    console.log("updateMessage response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("updateMessage response data:", result);
      return response.status;
    } else {
      console.warn("updateMessage failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in updateMessage:", error.message, error.stack);
    return 500;
  }
}

// Delete a message
async function deleteMessage(accessToken, idMessage) {
  console.log("deleteMessage called with accessToken:", accessToken, "idMessage:", idMessage);
  try {
    const url = `${api_host}/api/messages`;
    console.log("Deleting message at URL:", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idMessage })
    });

    console.log("deleteMessage response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("deleteMessage response data:", result);
      return response.status;
    } else {
      console.warn("deleteMessage failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in deleteMessage:", error.message, error.stack);
    return 500;
  }
}

// Get all messages in a chat
async function getAllMessages(accessToken, idChat) {
   const chats = JSON.parse(localStorage.getItem("chat"));
    if (chats) {
      const result = chats.Messages;
      console.log("chats retrieved from localStorage:", result);
      console.log("getAllMessages response data:", result);
      localStorage.setItem("messages", JSON.stringify(result));
      console.log("Stored messages in localStorage:", result);
      return 200;
    } else {
      console.warn("getAllMessages failed with status:", response.status);
      return 500;
    }
  
}


// Get a single message
async function getMessage(accessToken, idMessage) {
  console.log("getMessage called with accessToken:", accessToken, "idMessage:", idMessage);
  try {
    const url = `${api_host}/api/messages/view-a?idMessage=${Number(idMessage)}`;
    console.log("Fetching message from URL:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    console.log("getMessage response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("getMessage response data:", result);
      localStorage.setItem("message", JSON.stringify(result));
      console.log("Stored message in localStorage:", result);
      return response.status;
    } else {
      console.warn("getMessage failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getMessage:", error.message, error.stack);
    return 500;
  }
}

// Get all messages (across all chats)
async function getAllMessagesAcrossChats(accessToken) {
  console.log("getAllMessagesAcrossChats called with accessToken:", accessToken);
  try {
    const url = `${api_host}/api/messages/viewAll`;
    console.log("Fetching all messages from URL:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    console.log("getAllMessagesAcrossChats response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("getAllMessagesAcrossChats response data:", result);
      localStorage.setItem("allMessages", JSON.stringify(result));
      console.log("Stored all messages in localStorage:", result);
      return response.status;
    } else {
      console.warn("getAllMessagesAcrossChats failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getAllMessagesAcrossChats:", error.message, error.stack);
    return 500;
  }
}