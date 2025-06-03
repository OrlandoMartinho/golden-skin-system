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
      localStorage.setItem("user",JSON.stringify(result))
      localStorage.setItem("accessToken",result.token)
      localStorage.setItem("userRole",result.role)
      localStorage.setItem("idUser",result.idUser)
      return response.status;
    } else {
      return response.status;
    }
  } catch (error) {
  
    return 500; // Erro interno
  }
}
