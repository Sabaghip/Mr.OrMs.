let cookie = document.cookie

let cache = {}

if(cookie.split("-").length > 1){
    for(i of cookie.split("-")){
        let temp = i.split(":")
        cache[temp[0]] = temp[1]
    }
}


async function checkform(event) {
    document.getElementById("result-string").innerHTML="wait for answer"
    document.getElementById("result-percent").innerHTML=""
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
    if(["male", "female"].includes(cache[name.value])){
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
            document.getElementById("result-percent").innerHTML="for this name"
        }
    }  
    catch(err){
        document.getElementById("result-string").innerHTML="connection problem"
        document.getElementById("result-percent").innerHTML="check connection"

        return
    }
  }

async function save(event) {
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
    let gender = null;
    for(i of document.getElementsByClassName("radio-button")){
        if(i.checked){
            gender = i.value
            break
        }
    }
    if(gender){
        cache[name.value] = gender
        document.cookie=""
        for(const [key, value] of Object.entries(cache)){
            document.cookie = document.cookie + key + ":" + value + "-"
        }
    }
  }

  async function clear(event) {
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
    cache[name.value]=null
    document.cookie=""
    for(const [key, value] of Object.entries(cache)){
        document.cookie = document.cookie + key + ":" + value + "-"
    }
    document.getElementById("saved-answer").innerHTML = ""
  }
document.getElementById("main-form").onsubmit = checkform;

document.getElementById("save-button").onclick = save;

document.getElementById("clear-button").onclick = clear;

