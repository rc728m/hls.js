//handle network selction
//objective: export network_value to Server.js

let network_value = null;
function networkChange(){
    var network = document.getElementById("network");
    var result = network.value;
    alert("Network changed to " + result);
    network_value = result;
  }




