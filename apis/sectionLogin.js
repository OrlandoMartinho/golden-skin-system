
setInterval(async () => {
    console.clear()
    await verifyUserData()
}, 1000);




async function verifyUserData(){
    const accessToken = localStorage.getItem("accessToken")
    const result = await getUser(accessToken)
    const userRole  = localStorage.getItem("userRole") 
    if(result == 200){
        if (userRole == 0) {
            window.location.href = "../admin/admin-home.html";
        } else {
            window.location.href = "../usuarios/user-home.html";
        }
    }else{
        
    }
    

}