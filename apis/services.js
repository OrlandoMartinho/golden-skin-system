// Add a new service
async function addService(accessToken, serviceData, file) {
  console.log("addService called with accessToken:", accessToken, "serviceData:", serviceData);

  const data = new FormData();

  // Add service data manually to FormData
  for (const key in serviceData) {
    if (serviceData.hasOwnProperty(key)) {
      data.append(key, serviceData[key]);
    }
  }

  // Add file if provided
  if (file) {
    data.append("file", file);
  }

  try {
    const url = `${api_host}/api/services/add`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        token: accessToken
      },
      body: data
    });

    if (response.ok) {
      const result = await response.json();
      console.log("addService response data:", result);
      return response.status;
    } else {
      console.warn("Erro ao adicionar serviço:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Erro no addService:", error);
    return 500;
  }
}

// Edit an existing service
async function editService(accessToken, serviceData, file) {
  console.log("editService called with accessToken:", accessToken, "serviceData:", serviceData);
  try {
    const url = `${api_host}/api/services/edit`;

    const data = new FormData();

    // Add service data manually to FormData
    for (const key in serviceData) {
      if (serviceData.hasOwnProperty(key)) {
        data.append(key, serviceData[key]);
      }
    }

    // Add file if provided
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

    console.log("editService response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("editService response data:", result);
      return response.status;
    } else {
      console.warn("editService failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in editService:", error.message, error.stack);
    return 500;
  }
}

// Delete a service
async function deleteService(accessToken, idService) {
  console.log("deleteService called with accessToken:", accessToken, "idService:", idService);
  try {
    const url = `${api_host}/api/services`;
    console.log("Deleting service at URL:", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idService })
    });

    console.log("deleteService response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("deleteService response data:", result);
      return response.status;
    } else {
      console.warn("deleteService failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in deleteService:", error.message, error.stack);
    return 500;
  }
}

// Get all services
async function getAllServices(accessToken) {
  console.log("getAllServices called with accessToken:", accessToken);
  try {
    const url = `${api_host}/api/services`;
    console.log("Fetching all services from URL:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    console.log("getAllServices response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("getAllServices response data:", result);
      localStorage.setItem("services", JSON.stringify(result));
      console.log("Stored services in localStorage:", result);
      return response.status;
    } else {
      console.warn("getAllServices failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getAllServices:", error.message, error.stack);
    return 500;
  }
}

// Get a single service
async function getService(accessToken, idService) {
  console.log("getService called with accessToken:", accessToken, "idService:", idService);
  try {
    const url = `${api_host}/api/services/${Number(idService)}`;
    console.log("Fetching service from URL:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    console.log("getService response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("getService response data:", result);
      localStorage.setItem("service", JSON.stringify(result));
      console.log("Stored service in localStorage:", result);
      return response.status;
    } else {
      console.warn("getService failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getService:", error.message, error.stack);
    return 500;
  }
}

// Upload a service photo
async function uploadServicePhoto(accessToken, idService, file) {
  console.log("uploadServicePhoto called with accessToken:", accessToken, "idService:", idService, "file:", file);
  try {
    const url = `${api_host}/api/services/upload-photo`;
    console.log("Uploading service photo at URL:", url);
    const formData = new FormData();
    formData.append('idService', idService.toString());
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        token: accessToken
      },
      body: formData
    });

    console.log("uploadServicePhoto response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("uploadServicePhoto response data:", result);
      return response.status;
    } else {
      console.warn("uploadServicePhoto failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in uploadServicePhoto:", error.message, error.stack);
    return 500;
  }
}