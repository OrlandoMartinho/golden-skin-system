async function addAnyAppointment(accessToken, appointmentData) {
  try {
    const url = `${api_host}/api/appointments/register`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(appointmentData)
    });

    const result = await response.json();

    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error adding appointment:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in addAnyAppointment:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function editAnyAppointment(accessToken, appointmentData) {
  try {
    const url = `${api_host}/api/appointments/update`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(appointmentData)
    });

    const result = await response.json();

    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error editing appointment:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in editAnyAppointment:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function deleteAnyAppointment(accessToken, idAppointment) {
  try {
    const url = `${api_host}/api/appointments`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idAppointment })
    });

    const result = await response.json();

    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error deleting appointment:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in deleteAnyAppointment:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function getAllAppointments(accessToken) {
  try {
    const url = `${api_host}/api/appointments`;
    console.log("Requesting appointments from:", url);
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
      localStorage.setItem("appointments", JSON.stringify(result));
      console.log("Appointments saved to localStorage.");
      return { status: response.status, data: result };
    } else {
      console.warn("Error getting all appointments:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in getAllAppointments:", error.message);
    console.error(error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function getAnyAppointment(accessToken, idAppointment) {
  try {
    console.log("Fetching with idAppointment:", idAppointment);
    const url = `${api_host}/api/appointments/${Number(idAppointment)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      }
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem("appointment", JSON.stringify(result));
      return { status: response.status, data: result };
    } else {
      console.warn("Error getting appointment:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in getAnyAppointment:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}

async function addEmployeeToAppointment(accessToken, employeeData) {
  try {
    const url = `${api_host}/api/appointments/add-employee`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(employeeData)
    });

    const result = await response.json();

    if (response.ok) {
      return { status: response.status, data: result };
    } else {
      console.warn("Error adding employee to appointment:", response.status, result.message);
      return { status: response.status, error: result };
    }
  } catch (error) {
    console.error("Error in addEmployeeToAppointment:", error.message, error.stack);
    return { status: 500, error: { message: "Internal server error" } };
  }
}