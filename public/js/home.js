var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
document.getElementById("rdvDate").setAttribute("min", yyyy + "-0" + mm + "-" + dd);
console.log(document.getElementById("rdvDate"));

// Everything except weekend days
const validate = dateString => {
    const day = (new Date(dateString)).getDay();
    if (day==0 || day==6) {
        return false;
    }
    return true;
}
  // Sets the value to '' in case of an invalid date
document.querySelector('#rdv_date').onchange = evt => {
    if (!validate(evt.target.value)) {
        evt.target.value = '';
        alert('Invalid date');
    }
}

// Fonction pour empécher de prendre un rdv si un ou plusieurs chalps ne sont pas remplis
function myFunction() {
    if(!document.getElementById("rdv_date").value) {
        console.log("test1")
        alert("Remplissez le champ Date")
    }else if(!document.getElementById("rdvHeure").value){
        console.log("test2")
        alert("Remplissez le champ Heure")
    }else if(!document.getElementById("nom").value){
        console.log("test3")
        alert("Remplissez le champ Nom")
    }else if(!document.getElementById("prenom").value){
        console.log("test4")
        alert("Remplissez le champ Prenom")
    }else if(!document.getElementById("email").value){
        console.log("test5")
        alert("Remplissez le champ Email")
    }
}