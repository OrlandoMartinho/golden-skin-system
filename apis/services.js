// Add a new service
async function addService(accessToken, serviceData, file) {

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
async function editAnyService(accessToken, serviceData, file) {
  console.log('Starting editService, accessToken:', accessToken, 'serviceData:', serviceData, 'file:', file ? file.name : 'No file provided'); // Log inputs
  try {
    const url = `${api_host}/api/services/edit`;
    console.log('API URL:', url); // Log constructed URL

    const data = new FormData();
    console.log('Creating FormData for service update'); // Log FormData creation

    // Add service data manually to FormData
    for (const key in serviceData) {
      if (serviceData.hasOwnProperty(key)) {
        data.append(key, serviceData[key]);
        console.log(`Appending to FormData: ${key}=${serviceData[key]}`); // Log each key-value pair
      }
    }

    // Add file if provided
    if (file) {
      data.append("file", file);
      console.log('File appended to FormData:', file.name, file.type, file.size); // Log file details
    } else {
      console.log('No file provided for upload'); // Log absence of file
    }

    console.log('Sending PUT request to API'); // Log request initiation
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        token: accessToken
      },
      body: data
    });

    console.log('Response received, status:', response.status, 'ok:', response.ok); // Log response status
    if (response.ok) {
      const result = await response.json();
      console.log('editService response data:', result); // Existing log for response data
      return response.status;
    } else {
      console.warn('editService failed with status:', response.status, 'statusText:', response.statusText); // Enhanced warn with statusText
      return response.status;
    }
  } catch (error) {
    console.error('Error in editService:', error.message, error.stack); // Existing error log
    return 500;
  }
}
// Delete a service
async function deleteAnyService(accessToken, idService) {
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

  try {
    const url = `${api_host}/api/services`;
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    
    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("services", JSON.stringify(result));
      return response.status;
    } else {
      return response.status;
    }
  } catch (error) {
    console.error("Error in getAllServices:", error.message, error.stack);
    return 500;
  }
}

// Get a single service
async function getService(accessToken, idService) {
 
  try {
    const url = `${api_host}/api/services/${Number(idService)}`;
 
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

 
    if (response.ok) {
      const result = await response.json();
  
      localStorage.setItem("service", JSON.stringify(result));

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
