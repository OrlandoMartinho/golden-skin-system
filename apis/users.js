const api_host = "http://localhost:3000";

async function getUser(accessToken) {
  try {
    const url = `${api_host}/api/users/view-a`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);

      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("userRole", result.userRole);
      localStorage.setItem("idUser", result.idUser);

      return response.status;
    } else {
      return response.status;
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    return 500; // Erro interno
  }
}
