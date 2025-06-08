async function addAnyPlan(accessToken, planData) {


  try {

 
    const url = `${api_host}/api/plans/register`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(planData)
    });

    const result = await response.json();
   
    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error adding plan:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in addPlan:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function editAnyPlan(accessToken, planData) {
  try {
    const url = `${api_host}/api/plans`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(planData)
    });

    const result = await response.json();
    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error editing plan:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in editPlan:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function deleteAnyPlan(accessToken, idPlan) {
  try {
    const url = `${api_host}/api/plans`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idPlan })
    });

    const result = await response.json();
    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error deleting plan:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in deletePlan:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function getAllPlanss(accessToken) {
  try {
    const url = `${api_host}/api/plans`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    const result = await response.json();
   
    if (response.ok) {
      localStorage.setItem("plans", JSON.stringify(result));
      return { status: response.status, data: result };
    } else {
      console.warn("Error getting all plans:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in getAllPlans:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function getAnyPlan(accessToken, idPlan) {
  try {

    console.log("Fetching witch idPlan:",idPlan)
    const url = `${api_host}/api/plans/view/${Number(idPlan)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("plan", JSON.stringify(result));
      return { status: response.status, data: result };
    } else {
      console.warn("Error getting plan:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in getPlan:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}