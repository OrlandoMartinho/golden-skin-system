

// Register a new product
// Register a new product
async function registerProduct(accessToken, productData, file) {
  console.log("registerProduct called with accessToken:", accessToken, "productData:", productData);

  const data = new FormData();

  // Adiciona os dados do produto manualmente ao FormData
  for (const key in productData) {
    if (productData.hasOwnProperty(key)) {
      data.append(key, productData[key]);
    }
  }

  // Adiciona o arquivo
  if (file) {
    data.append("file", file);
  }

  try {
    const url = `${api_host}/api/products/register`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        token: accessToken
      },
      body: data
    });

    if (response.ok) {
      const result = await response.json();
      console.log("registerProduct response data:", result);
      return response.status;
    } else {
      console.warn("Erro ao registrar produto:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Erro no registerProduct:", error);
    return 500;
  }
}


// Update an existing product
async function updateProduct(accessToken, productData,file) {
  console.log("updateProduct called with accessToken:", accessToken, "productData:", productData);
  try {
    const url = `${api_host}/api/products/update`;

     const data = new FormData();

  // Adiciona os dados do produto manualmente ao FormData
  for (const key in productData) {
    if (productData.hasOwnProperty(key)) {
      data.append(key, productData[key]);
    }
  }

  // Adiciona o arquivo
  if (file) {
    data.append("file", file);
  }
  
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        token: accessToken
      },
      body: data
    });

    console.log("updateProduct response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("updateProduct response data:", result);
      return response.status;
    } else {
      console.warn("updateProduct failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in updateProduct:", error.message, error.stack);
    return 500;
  }
}

// Delete a product
async function deleteAnyProduct(accessToken, idProduct) {
  console.log("deleteProduct called with accessToken:", accessToken, "idProduct:", idProduct);
  try {
    const url = `${api_host}/api/products`;
    console.log("Deleting product at URL:", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idProduct })
    });

    console.log("deleteProduct response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("deleteProduct response data:", result);
      return response.status;
    } else {
      console.warn("deleteProduct failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in deleteProduct:", error.message, error.stack);
    return 500;
  }
}

// Get all products
async function getAllProducts(accessToken) {
  console.log("getAllProducts called with accessToken:", accessToken);
  try {
    const url = `${api_host}/api/products`;
    console.log("Fetching all products from URL:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    console.log("getAllProducts response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("getAllProducts response data:", result);
      localStorage.setItem("products", JSON.stringify(result));
      console.log("Stored products in localStorage:", result);
      return response.status;
    } else {
      console.warn("getAllProducts failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getAllProducts:", error.message, error.stack);
    return 500;
  }
}

// Get a single product
async function getProduct(accessToken, idProduct) {
  console.log("getProduct called with accessToken:", accessToken, "idProduct:", idProduct);
  try {
    const url = `${api_host}/api/products/${Number(idProduct)}`;
    console.log("Fetching product from URL:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    console.log("getProduct response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("getProduct response data:", result);
      localStorage.setItem("product", JSON.stringify(result));
      console.log("Stored product in localStorage:", result);
      return response.status;
    } else {
      console.warn("getProduct failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getProduct:", error.message, error.stack);
    return 500;
  }
}

// Upload a product photo
async function uploadProductPhoto(accessToken, idProduct, file) {
  console.log("uploadProductPhoto called with accessToken:", accessToken, "idProduct:", idProduct, "file:", file);
  try {
    const url = `${api_host}/api/products/upload-photo`;
    console.log("Uploading product photo at URL:", url);
    const formData = new FormData();
    formData.append('idProduct', idProduct);
    formData.append('photo', file);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        token: accessToken
      },
      body: formData
    });

    console.log("uploadProductPhoto response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("uploadProductPhoto response data:", result);
      return response.status;
    } else {
      console.warn("uploadProductPhoto failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in uploadProductPhoto:", error.message, error.stack);
    return 500;
  }
}