
setInterval(async () => {
    console.clear()
    await verifyUserData()
}, 1000);





async function verifyUserData(){
    const accessToken = localStorage.getItem("accessToken")
    const result = await getUser(accessToken)

    if(result !== 200){
    showMessageModal('error', 'Erro!', 'Sessão expirada por favor faça login novamente', {
      buttonText: 'Entendido'
    });   
       window.location.href = "../sessoes/login.html";
    }else{
        var userName =JSON.parse(localStorage.getItem("user")).name
        document.getElementById("userName").textContent = userName
    }
    

}