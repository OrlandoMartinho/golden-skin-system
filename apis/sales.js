
// Get all sales
async function getAllSales(accessToken) {
  console.log("getAllSales called with accessToken:", accessToken);
  try {
    const url = `${api_host}/api/purchase-products`;
    console.log("Fetching all sales from URL:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    console.log("getAllSales response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("getAllSales response data:", result);
      localStorage.setItem("sales", JSON.stringify(result));
      console.log("Stored sales in localStorage:", result);
      return response.status;
    } else {
      console.warn("getAllSales failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getAllSales:", error.message, error.stack);
    return 500;
  }
}

// Get a single sale
async function getSale(accessToken, idSale) {
  console.log("getSale called with accessToken:", accessToken, "idSale:", idSale);
  try {
    const url = `${api_host}/api/purchase-products/view-a?idSale=${Number(idSale)}`;
    console.log("Fetching sale from URL:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    console.log("getSale response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("getSale response data:", result);
      localStorage.setItem("sale", JSON.stringify(result));
      console.log("Stored sale in localStorage:", result);
      return response.status;
    } else {
      console.warn("getSale failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getSale:", error.message, error.stack);
    return 500;
  }
}

// Update a sale's status
async function editAnySale(accessToken, saleData) {
  console.log("editAnySale called with accessToken:", accessToken, "saleData:", saleData);
  try {
    const url = `${api_host}/api/purchase-products/update`;
    const data = new FormData();

    // Adiciona os dados da venda manualmente ao FormData
    for (const key in saleData) {
      if (saleData.hasOwnProperty(key)) {
        data.append(key, saleData[key]);
      }
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        token: accessToken
      },
      body: data
    });

    console.log("editAnySale response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("editAnySale response data:", result);
      return response.status;
    } else {
      console.warn("editAnySale failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in editAnySale:", error.message, error.stack);
    return 500;
  }
}

// Delete a sale
async function deleteAnySale(accessToken, idSale) {
  console.log("deleteAnySale called with accessToken:", accessToken, "idSale:", idSale);
  try {
    const url = `${api_host}/api/purchase-products`;
    console.log("Deleting sale at URL:", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idSale })
    });

    console.log("deleteAnySale response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("deleteAnySale response data:", result);
      return response.status;
    } else {
      console.warn("deleteAnySale failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in deleteAnySale:", error.message, error.stack);
    return 500;
  }
}
