
setInterval(async () => {
    await verifyUserData()
}, 500);




async function verifyUserData(){
    const accessToken = localStorage.getItem("accessToken")
    const result = await getUser(accessToken)

    if(result == 200){
       window.location.href = "../pages/sessoes/login.html";
    }
    

}