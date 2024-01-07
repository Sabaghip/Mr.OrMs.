let cache = {}

async function checkform(event) {
    event.preventDefault();
    let name = document.getElementById("name-field");
    reg_expr = /^[A-Za-z\s]*$/;
    if(!reg_expr.test(name.value)){
        document.getElementById("result-string").innerHTML="invalid name"
        document.getElementById("result-percent").innerHTML=""
        return
    }
    if(name.length > 255){
        document.getElementById("result-string").innerHTML="invalid name"
        document.getElementById("result-percent").innerHTML=""
        return
    }
    if(cache[name.value]){
        document.getElementById("saved-answer").innerHTML = cache[name.value]
    }
    else{
        document.getElementById("saved-answer").innerHTML = ""
    }
    try{
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
    catch(err){
        document.getElementById("result-string").innerHTML="cant predict gender"
        document.getElementById("result-percent").innerHTML="check connection"
        console.log(err)
        return
    }
  }

async function save(event) {
    event.preventDefault();
    let name = document.getElementById("name-field");
    reg_expr = /^[A-Za-z\s]*$/;
    if(!reg_expr.test(name.value)){
        return
    }
    if(name.length > 255){
        return
    }
    let gender = null;
    for(i of document.getElementsByClassName("radio-button")){
        if(i.checked){
            gender = i.value
            break
        }
    }
    if(gender){
        cache[name.value] = gender
    }
  }

  async function clear(event) {
    event.preventDefault();
    let name = document.getElementById("name-field");
    reg_expr = /^[A-Za-z\s]*$/;
    if(!reg_expr.test(name.value)){
        return
    }
    if(name.length > 255){
        return
    }
    cache[name.value]=null
    document.getElementById("saved-answer").innerHTML = ""
  }
document.getElementById("main-form").onsubmit = checkform;

document.getElementById("save-button").onclick = save;

document.getElementById("clear-button").onclick = clear;

