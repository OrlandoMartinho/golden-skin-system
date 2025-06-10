async function addAnyShopping(accessToken, shoppingData) {
  try {
    const url = `${api_host}/api/shoppings/register`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(shoppingData)
    });

    const result = await response.json();
   
    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error adding shopping:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in addShopping:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function editAnyShopping(accessToken, shoppingData) {
  try {
    const url = `${api_host}/api/shoppings/update`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(shoppingData)
    });

    const result = await response.json();
    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error editing shopping:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in editShopping:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function deleteAnyShopping(accessToken, idShopping) {
  try {
    const url = `${api_host}/api/shoppings`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idShopping })
    });

    const result = await response.json();
    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error deleting shopping:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in deleteShopping:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function getAllShoppings(accessToken) {
  try {
    const url = `${api_host}/api/shoppings`;
    console.log("Requesting shoppings from:", url);
    console.log("Access token:", accessToken);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    console.log("Response status:", response.status);

    const result = await response.json();
    console.log("Response data:", result);

    if (response.ok) {
      localStorage.setItem("shoppings", JSON.stringify(result));
      console.log("Shoppings saved to localStorage.");
      return { status: response.status, data: result };
    } else {
      console.warn("Error getting all shoppings:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in getAllShoppings:", error.message);
    console.error(error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}


async function getAnyShopping(accessToken, idShopping) {
  try {
    console.log("Fetching with idShopping:", idShopping);
    const url = `${api_host}/api/shoppings/view-a/${Number(idShopping)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("shopping", JSON.stringify(result));
      return { status: response.status, data: result };
    } else {
      console.warn("Error getting shopping:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in getShopping:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}