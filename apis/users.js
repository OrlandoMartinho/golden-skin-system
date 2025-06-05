
const api_host = "http://localhost:3000";

// Get single user information
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

      localStorage.setItem("user", JSON.stringify(result));
      localStorage.setItem("accessToken", result.token);
      localStorage.setItem("userRole", result.role);
      localStorage.setItem("idUser", result.idUser);
   
      return response.status;
    } else {

      return response.status;
    }
  } catch (error) {
 
    return 500;
  }
}

// Get all users
async function getAllUser(accessToken) {

  try {
    const url = `${api_host}/api/users`;
   
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
    });

    
    if (response.ok) {
      const result = await response.json();

      localStorage.setItem("users", JSON.stringify(result));
    
      return response.status;
    } else {
     
      return response.status;
    }
  } catch (error) {
   
    return 500;
  }
}

// Register a new user
async function registerUser(userData) {
 
  try {
    const url = `${api_host}/api/users/register`;
  ;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });


    if (response.ok) {
      const result = await response.json();
     
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("userRole", result.userRole);
      localStorage.setItem("idUser", result.idUser);
      
      return response.status;
    } else {

      return response.status;
    }
  } catch (error) {
   
    return 500;
  }
}

// Authenticate user
async function authenticateUser(credentials) {
  console.log("authenticateUser called with credentials:", credentials);
  try {
    const url = `${api_host}/api/users/authenticate`;
    console.log("Authenticating user at URL:", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    console.log("authenticateUser response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("authenticateUser response data:", result);
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("userRole", result.userRole);
      localStorage.setItem("idUser", result.idUser);
      console.log("Stored authentication data in localStorage:", {
        accessToken: result.accessToken,
        userRole: result.userRole,
        idUser: result.idUser
      });
      return response.status;
    } else {
      console.warn("authenticateUser failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in authenticateUser:", error.message, error.stack);
    return 500;
  }
}

// Request authentication code
async function receiveCode(email) {
  console.log("receiveCode called with email:", email);
  try {
    const url = `${api_host}/api/users/receive-code`;
    console.log("Requesting auth code at URL:", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    console.log("receiveCode response status:", response.status);
    if (response.ok) {
      console.log("Authentication code requested successfully");
      return response.status;
    } else {
      console.warn("receiveCode failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in receiveCode:", error.message, error.stack);
    return 500;
  }
}

// Recover password using code
async function recoverPassword(recoveryData) {
  console.log("recoverPassword called with recoveryData:", recoveryData);
  try {
    const url = `${api_host}/api/users/recover-password`;
    console.log("Recovering password at URL:", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recoveryData)
    });

    console.log("recoverPassword response status:", response.status);
    if (response.ok) {
      console.log("Password recovered successfully");
      return response.status;
    } else {
      console.warn("recoverPassword failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in recoverPassword:", error.message, error.stack);
    return 500;
  }
}

// Change user email
async function changeEmail(accessToken, emailData) {
  console.log("changeEmail called with accessToken:", accessToken, "emailData:", emailData);
  try {
    const url = `${api_host}/api/users/change-email`;
    console.log("Changing email at URL:", url);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(emailData)
    });

    console.log("changeEmail response status:", response.status);
    if (response.ok) {
      console.log("Email changed successfully");
      return response.status;
    } else {
      console.warn("changeEmail failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in changeEmail:", error.message, error.stack);
    return 500;
  }
}

// Edit user password
async function editPassword(accessToken, passwordData) {
  console.log("editPassword called with accessToken:", accessToken, "passwordData:", passwordData);
  try {
    const url = `${api_host}/api/users/password-edit`;
    console.log("Editing password at URL:", url);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(passwordData)
    });

    console.log("editPassword response status:", response.status);
    if (response.ok) {
      console.log("Password edited successfully");
      return response.status;
    } else {
      console.warn("editPassword failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in editPassword:", error.message, error.stack);
    return 500;
  }
}

// Update user information
async function updateUser(accessToken, userData) {
  console.log("updateUser called with accessToken:", accessToken, "userData:", userData);

  const data={
      name:userData.name,
      status: userData.status,
      phoneNumber: userData.phoneNumber
  }


  try {
    const url = `${api_host}/api/users/update`;
    console.log("Updating user at URL:", url);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify(data)
    });

    console.log("updateUser response status:", response.status);
    if (response.ok) {
      console.log("User updated successfully");
      return response.status;
    } else {
      console.warn("updateUser failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in updateUser:", error.message, error.stack);
    return 500;
  }
}

// Delete user account
async function deleteAnyUser(accessToken, idUser) {
  console.log("deleteUser called with accessToken:", accessToken, "idUser:", idUser);
  try {
    const url = `${api_host}/api/users`;
    console.log("Deleting user at URL:", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: accessToken
      },
      body: JSON.stringify({ idUser })
    });

    console.log("deleteUser response status:", response.status);
    if (response.ok) {
      console.log("User deleted successfully");
      return response.status;
    } else {
      console.warn("deleteUser failed with status:", response.status);
      return response.status;
    }
  } catch (error) {
    console.error("Error in deleteUser:", error.message, error.stack);
    return 500;
  }
}

// Upload user photo
async function uploadPhoto(accessToken, file) {
  console.log("uploadPhoto called with accessToken:", accessToken, "file:", file);
  try {
    const url = `${api_host}/api/users/upload-photo`;
    console.log("Uploading photo at URL:", url);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        token: accessToken
      },
      body: formData
    });

    console.log("uploadPhoto response status:", response.status);
    if (response.ok) {
      const result = await response.json();
      console.log("uploadPhoto response data:", result);
      return { status: response.status, url: result.url };
    } else {
      console.warn("uploadPhoto failed with status:", response.status);
      return { status: response.status };
    }
  } catch (error) {
    console.error("Error in uploadPhoto:", error.message, error.stack);
    return { status: 500 };
  }
}
