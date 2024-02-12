const socketClient = io();

const form = document.getElementById("chatForm");
const inputText = document.getElementById("chatMessage");
const h3Name = document.getElementById("name");
const div = document.getElementById("showChat");

Swal.fire({
    title: 'Bienvenide!',
    input: 'text',
    inputLabel: 'Ingresa tu nombre',
    showCancelButton: true,
    inputValidator: (value) => {
        if (!value) {
            return 'No olvides ingrersar tu nombre!'
        }
    },
    confirmButtonText: 'Ingresar'
    
}).then(input =>{
    user=input.value;
    h3Name.innerText= `Te uniste al chat como ${user}`;
    socketClient.emit('newChatUser', user);

});

socketClient.on('newChatUserBroadcast', (user)=>{
    console.log(`se ha unido ${user}`); 

    Toastify({
        text: `se ha unido ${user}`,
        duration: 3000
    }).showToast();
    
})

//chatMessages
form.onsubmit=(e)=>{
    e.preventDefault();
    const newChatMessage ={
        name: user,
        message : inputText.value,
    }
    socketClient.emit('newChatMessage', newChatMessage);
}

socketClient.on("chatMessages", (messages)=>{
    div.innerHTML = "";

    messages.forEach((message) => {
        const pElement = document.createElement("p");
        const bElement = document.createElement("b");

        bElement.innerText = `${message.name}: `;
        pElement.appendChild(bElement);
        pElement.innerText = `${message.name}: ${message.message}`;


        div.appendChild(pElement);
    });
    inputText.value="";
})