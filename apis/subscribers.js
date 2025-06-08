async function addSubscriber(accessToken, subscriberData) {
  const data = new FormData();

  // Add subscriber data manually to FormData
  for (const key in subscriberData) {
    if (subscriberData.hasOwnProperty(key)) {
      data.append(key, subscriberData[key]);
    }
  }

  try {
    const url = `${api_host}/api/subscribers/add`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        token: accessToken
      },
      body: data
    });

    if (response.ok) {
      const result = await response.json();
      return response.status;
    } else {
      console.warn("Erro ao adicionar assinante:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Erro no addSubscriber:", error.message, error.stack);
    return 500;
  }
}

async function editAnySubscriber(accessToken, subscriberData) {
  console.log('Starting editSubscriber, accessToken:', accessToken, 'subscriberData:', subscriberData);
  try {
    const url = `${api_host}/api/subscribers/edit`;
    console.log('API URL:', url);

    const data = new FormData();
    console.log('Creating FormData for subscriber update');

    // Add subscriber data manually to FormData
    for (const key in subscriberData) {
      if (subscriberData.hasOwnProperty(key)) {
        data.append(key, subscriberData[key]);
        console.log(`Appending to FormData: ${key}=${subscriberData[key]}`);
      }
    }

    console.log('Sending PUT request to API');
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        token: accessToken
      },
      body: data
    });

    console.log('Response received, status:', response.status, 'ok:', response.ok);
    if (response.ok) {
      const result = await response.json();
      console.log('editSubscriber response data:', result);
      return response.status;
    } else {
      console.warn('editSubscriber failed with status:', response.status, 'statusText:', response.statusText);
      return response.status;
    }
  } catch (error) {
    console.error('Error in editSubscriber:', error.message, error.stack);
    return 500;
  }
}

async function deleteAnySubscriber(accessToken, idSubscriber) {
  console.log("deleteSubscriber called with accessToken:", accessToken, "idSubscriber:", idSubscriber);
  try {
    const url = `${api_host}/api/subscribers`;
    console.log("Deleting subscriber at URL:", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idSubscriber })
    });

    console.log("deleteSubscriber response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("deleteSubscriber response data:", result);
      return response.status;
    } else {
      console.warn("deleteSubscriber failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in deleteSubscriber:", error.message, error.stack);
    return 500;
  }
}

async function getAllSubscribers(accessToken) {
  try {
    const url = `${api_host}/api/subscribers`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("subscribers", JSON.stringify(result));
      return response.status;
    } else {
      console.warn("getAllSubscribers failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getAllSubscribers:", error.message, error.stack);
    return 500;
  }
}

async function getSubscriber(accessToken, idSubscriber) {
  try {
    const url = `${api_host}/api/subscribers/${Number(idSubscriber)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("subscriber", JSON.stringify(result));
      return response.status;
    } else {
      console.warn("getSubscriber failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getSubscriber:", error.message, error.stack);
    return 500;
  }
}