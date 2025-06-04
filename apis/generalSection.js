
setInterval(async () => {
    console.clear()
    await verifyUserData()
}, 1000);





async function verifyUserData(){
    const accessToken = localStorage.getItem("accessToken")
    const result = await getUser(accessToken)
    console.log(result)
    if(result !== 200){
    showMessageModal('error', 'Erro!', 'Sessão expirada por favor faça login novamente', {
      buttonText: 'Entendido'
    });   
       window.location.href = "../sessoes/login.html";
    }else{
        var user =JSON.parse(localStorage.getItem("user"))

        const userProfile = document.querySelector('.user-profile');

        // Limpa conteúdo antigo (exceto dropdown)
        const dropdown = userProfile.querySelector('.dropdown-content');
        userProfile.innerHTML = ''; // limpa tudo
        userProfile.appendChild(dropdown); // guarda o dropdown

        // Cria dinamicamente a imagem ou ícone e o nome
        const iconOrImage = document.createElement(user.photo ? 'img' : 'i');

        if (user.image) {
            iconOrImage.src = user.image;
            iconOrImage.alt = 'User Image';
            iconOrImage.style.width = '30px';
            iconOrImage.style.height = '30px';
            iconOrImage.style.borderRadius = '50%';
            iconOrImage.style.objectFit = 'cover';
        } else {
            iconOrImage.className = 'fa-solid fa-user';
        }

        // Cria o span com o nome e o ícone da seta
        const span = document.createElement('span');
        span.innerHTML = `${user.name} <i class="fas fa-chevron-down"></i>`;

        // Insere no DOM antes do dropdown
        userProfile.insertBefore(iconOrImage, dropdown);
        userProfile.insertBefore(span, dropdown);
    }
    

}