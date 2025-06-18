
// Registrar um novo assinante
async function registerSubscriber(accessToken, subscriberData) {
  try {
    console.log("Subscriber data:", subscriberData);
    const url = `${api_host}/api/subscribers/register`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(subscriberData)
    });

    const result = await response.json();
    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn('Error registering subscriber:', response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error('Error in registerSubscriber:', error.message, error.stack);
    return { status: 500, error: { message: 'Internal server error' } };
  }
}

// Atualizar um assinante
async function editAnySubscriber(accessToken, subscriberData) {
  try {
    const url = `${api_host}/api/subscribers`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(subscriberData)
    });

    const result = await response.json();
    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn('Error updating subscriber:', response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error('Error in updateSubscriber:', error.message, error.stack);
    return { status: 500, error: { message: 'Internal server error' } };
  }
}

// Deletar um assinante
async function deleteAnySubscriber(accessToken, idSubscriber) {
  try {
    const url = `${api_host}/api/subscribers`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idSubscriber })
    });

    const result = await response.json();
    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn('Error deleting subscriber:', response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error('Error in deleteSubscriber:', error.message, error.stack);
    return { status: 500, error: { message: 'Internal server error' } };
  }
}

// Visualizar todos os assinantes
async function getAllSubscribers(accessToken) {
  try {
    const url = `${api_host}/api/subscribers`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('subscribers', JSON.stringify(result));
      return { status: response.status, data: result };
    } else {
      console.warn('Error getting all subscribers:', response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error('Error in getAllSubscribers:', error.message, error.stack);
    return { status: 500, error: { message: 'Internal server error' } };
  }
}

// Visualizar um único assinante
async function getSubscriber(accessToken, idSubscriber) {
  try {
    const url = `${api_host}/api/subscribers/view/${idSubscriber}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('subscriber', JSON.stringify(result));
      return { status: response.status, data: result };
    } else {
      console.warn('Error getting subscriber:', response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error('Error in getSubscriber:', error.message, error.stack);
    return { status: 500, error: { message: 'Internal server error' } };
  }
}