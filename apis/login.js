
const api_host = "http://localhost:3000";

async function authenticate(email, password) {
  try {
    const url = `${api_host}/api/users/authenticate`;

    const data = {
      email,
      password
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
    const result = await response.json();
    console.log(result);
     

    localStorage.setItem("accessToken",result.accessToken)
    localStorage.setItem("userRole",result.userRole),
    localStorage.setItem("idUser",result.idUser)

      return response.status;
    } else {
      return response.status;
    }

  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    return 500; // Erro interno
  }
}