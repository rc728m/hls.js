//handle network selction
//objective: export network_value to Server.js

async function networkChange(){
    var network = document.getElementById("network");
    var result = network.value;
    alert("Network changed to " + result);
    await axios.get(`http://localhost:3000/network?networkValue=${result}`);
}




