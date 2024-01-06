async function checkform(event) {
    event.preventDefault();
    let name = document.getElementById("name-field");
    reg_expr = /^[A-Za-z\s]*$/;
    if(!reg_expr.test(name.value)){
        return
    }
    if(name.length > 255){
        return
    }
    let sex = null;
    for(i of document.getElementsByClassName("radio-button")){
        if(i.checked){
            sex = i.value
            break
        }
    }
    const response = await fetch('https://api.genderize.io/?' + new URLSearchParams({
            name: name.value,
        }));
    const data = await response.json();
    if(data.gender){
        document.getElementById("result-string").innerHTML=data.gender
        document.getElementById("result-percent").innerHTML=data.probability
    }
    else{
        document.getElementById("result-string").innerHTML="cant predict gender"
        document.getElementById("result-percent").innerHTML=""
    }
    
  }
document.getElementById("main-form").onsubmit = checkform;