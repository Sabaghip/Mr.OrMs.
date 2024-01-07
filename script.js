let cookie = document.cookie

let cache = {}

// processed cookie to get saved answers
if(cookie.split("-").length > 1){
    for(i of cookie.split("-")){
        let temp = i.split(":")
        cache[temp[0]] = temp[1]
    }
}

// function to check foem and send request to other site and show result
async function checkform(event) {
    // show message to user in result field
    document.getElementById("result-string").innerHTML="wait for answer"
    document.getElementById("result-percent").innerHTML=""
    // prevent form to submit by default
    event.preventDefault();
    let name = document.getElementById("name-field");
    // use regex to check name
    reg_expr = /^[A-Za-z\s]*$/;
    if(!reg_expr.test(name.value)){
        // show message to user in result field if name is invalid
        document.getElementById("result-string").innerHTML="invalid name"
        document.getElementById("result-percent").innerHTML=""
        return
    }
    if(name.length > 255){
        // show message to user in result field if name has more than 255 chars
        document.getElementById("result-string").innerHTML="invalid name"
        document.getElementById("result-percent").innerHTML=""
        return
    }
    // show result to user in saved answers field if name is in cache
    if(["male", "female"].includes(cache[name.value])){
        document.getElementById("saved-answer").innerHTML = cache[name.value]
    }
    // clear result in saved answers field if name is not in cache
    else{
        document.getElementById("saved-answer").innerHTML = ""
    }
    try{
        // send request for result
        const response = await fetch('https://api.genderize.io/?' + new URLSearchParams({
                name: name.value,
            }));
        const data = await response.json();
        //if result has gender show that to user in result field
        if(data.gender){
            document.getElementById("result-string").innerHTML=data.gender
            document.getElementById("result-percent").innerHTML=data.probability
        }
        //if result doesnt have gender show message to user in result field
        else{
            document.getElementById("result-string").innerHTML="cant predict gender"
            document.getElementById("result-percent").innerHTML="for this name"
        }
    }  
    //if cant send request show message to user in result field
    catch(err){
        document.getElementById("result-string").innerHTML="cant send request"
        document.getElementById("result-percent").innerHTML="check connection"
        return
    }
}
  
// function to save a saved answer to cach and cookie
async function save(event) {
    // get name field and check if name is valid(like checkform)
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
    // get radio buttons result
    let gender = null;
    for(i of document.getElementsByClassName("radio-button")){
        if(i.checked){
            gender = i.value
            break
        }
    }
    //update cache and cookie if a radio button is selected
    if(gender){
        cache[name.value] = gender
        document.cookie=""
        for(const [key, value] of Object.entries(cache)){
            document.cookie = document.cookie + key + ":" + value + "-"
        }
    }
}

// function to delete a saved answer from cach and cookie
async function clear(event) {
    // get name field and check if name is valid(like checkform)
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
    //remove saved answer from cache and cookie
    cache[name.value]=null
    document.cookie=""
    for(const [key, value] of Object.entries(cache)){
        document.cookie = document.cookie + key + ":" + value + "-"
    }
    document.getElementById("saved-answer").innerHTML = ""
}

//add listeners to buttons 
document.getElementById("main-form").onsubmit = checkform;

document.getElementById("save-button").onclick = save;

document.getElementById("clear-button").onclick = clear;

