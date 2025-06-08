async function addPlan(accessToken, planData) {
  const data = new FormData();

  // Add plan data manually to FormData
  for (const key in planData) {
    if (planData.hasOwnProperty(key)) {
      data.append(key, planData[key]);
    }
  }

  try {
    const url = `${api_host}/api/plans/add`;

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
      console.warn("Erro ao adicionar plano:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Erro no addPlan:", error.message, error.stack);
    return 500;
  }
}

async function editAnyPlan(accessToken, planData) {
  console.log('Starting editPlan, accessToken:', accessToken, 'planData:', planData);
  try {
    const url = `${api_host}/api/plans/edit`;
    console.log('API URL:', url);

    const data = new FormData();
    console.log('Creating FormData for plan update');

    // Add plan data manually to FormData
    for (const key in planData) {
      if (planData.hasOwnProperty(key)) {
        data.append(key, planData[key]);
        console.log(`Appending to FormData: ${key}=${planData[key]}`);
      }
    }

    console.log('Sending PUT request to API');
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        token: accessToken
      },
      body: data
    });

    console.log('Response received, status:', response.status, 'ok:', response.ok);
    if (response.ok) {
      const result = await response.json();
      console.log('editPlan response data:', result);
      return response.status;
    } else {
      console.warn('editPlan failed with status:', response.status, 'statusText:', response.statusText);
      return response.status;
    }
  } catch (error) {
    console.error('Error in editPlan:', error.message, error.stack);
    return 500;
  }
}

async function deleteAnyPlan(accessToken, idPlan) {
  console.log("deletePlan called with accessToken:", accessToken, "idPlan:", idPlan);
  try {
    const url = `${api_host}/api/plans`;
    console.log("Deleting plan at URL:", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idPlan })
    });

    console.log("deletePlan response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("deletePlan response data:", result);
      return response.status;
    } else {
      console.warn("deletePlan failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in deletePlan:", error.message, error.stack);
    return 500;
  }
}

async function getAllPlans(accessToken) {
  try {
    const url = `${api_host}/api/plans`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("plans", JSON.stringify(result));
      return response.status;
    } else {
      console.warn("getAllPlans failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getAllPlans:", error.message, error.stack);
    return 500;
  }
}

async function getPlan(accessToken, idPlan) {
  try {
    const url = `${api_host}/api/plans/${Number(idPlan)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("plan", JSON.stringify(result));
      return response.status;
    } else {
      console.warn("getPlan failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in getPlan:", error.message, error.stack);
    return 500;
  }
}