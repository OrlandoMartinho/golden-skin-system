



async function getNotifications(accessToken) {
  try {
    const url = `${api_host}/api/notifications`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    if (response.ok) {
      const result = await response.json();
      return result
    } else {
      return null;
    }
  } catch (error) {
  
    return null; // Erro interno
  }
}