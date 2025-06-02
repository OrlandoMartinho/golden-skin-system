
setInterval(async () => {
    await verifyUserData()
}, 3000);




async function verifyUserData(){
    const accessToken = localStorage.getItem("accessToken")
    const result = await getUser(accessToken)

    if(result == 200){
        if (userRole == 0) {
            // window.location.href = "../pages/admin/admin-home.html";
        } else {
            // window.location.href = "../pages/usuarios/user-home.html";
        }
    }else{
        //  window.location.href = "../pages/sessoes/login.html";
    }
    

}