async function addAnyMessage(accessToken, messageData) {
  try {
    const url = `${api_host}/api/messages/register`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(messageData)
    });

    const result = await response.json();
   
    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error adding message:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in addMessage:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function editAnyMessage(accessToken, messageData) {
  try {
    const url = `${api_host}/api/messages/update`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(messageData)
    });

    const result = await response.json();
    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error editing message:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in editMessage:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function deleteAnyMessage(accessToken, idMessage) {
  try {
    const url = `${api_host}/api/messages`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idMessage })
    });

    const result = await response.json();
    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error deleting message:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in deleteMessage:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function getAllMessages(accessToken, chatId) {
  try {
    const url = `${api_host}/api/messages/${Number(chatId)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    const result = await response.json();
   
    if (response.ok) {
      localStorage.setItem("messages", JSON.stringify(result));
      return { status: response.status, data: result };
    } else {
      console.warn("Error getting all messages:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in getAllMessages:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}


async function getAlllMessages(accessToken, chatId) {
  try {
    const url = `${api_host}/api/messages/viewAll`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    const result = await response.json();
   
    if (response.ok) {
      localStorage.setItem("messages", JSON.stringify(result));
      return { status: response.status, data: result };
    } else {
      console.warn("Error getting all messages:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in getAllMessages:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function getAnyMessage(accessToken, idMessage) {
  try {
    console.log("Fetching with idMessage:", idMessage);
    const url = `${api_host}/api/messages/view-a/${Number(idMessage)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("message", JSON.stringify(result));
      return { status: response.status, data: result };
    } else {
      console.warn("Error getting message:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in getMessage:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}