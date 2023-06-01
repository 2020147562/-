let counter = 0
let feeling = "All";
let purpose = "";
let products;
let number;
let recomarray;


fetch("/recipe.json", {
    method: 'POST'
})
    .then(response => response.json())
    .then(json => {
        products = json;
    })
    .catch(err => { console.log(err) });

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("recommend").addEventListener("click", setSearchOption, false);
});            

function setSearchOption() {
    feeling = document.getElementById("feeling").value;
    purpose = document.getElementById("purpose").value;
    recomarray = new Array();
    clearimage();
    loadimage();

}

function loadimage() { 
        if(feeling === "sad") {
            loadfilter1();
        }
        else if(feeling === "bad") {
            loadfilter2();
        }
        else {
            loadfilter3();
        }
}

function loadfilter1() {
    for(let d in products) {
        if(products[d].RCP_TTL.includes("달콤") || products[d].CKG_IPDC.includes("달콤")) {
            if(products[d].CKG_STA_ACTO_NM.includes(purpose)) {
                recomarray.push(products[d]); 
            }
        }
    }  
    appendimage(recomarray);
}

function loadfilter2() {
    for(let e in products) {
        if(products[e].RCP_TTL.includes("매콤") || products[e].CKG_IPDC.includes("매콤")) {
            if(products[e].CKG_STA_ACTO_NM.includes(purpose)) {
                recomarray.push(products[e]); 
            }
        }
    }
    appendimage(recomarray);
}

function loadfilter3() {
    for(let f in products) {
        if(products[f].CKG_STA_ACTO_NM.includes(purpose)) {
            recomarray.push(products[f]); 
        }
    }
    appendimage(recomarray);
}


function clearimage() {
    let image = document.getElementById("results");
    while(image.hasChildNodes()) {
        image.removeChild(image.firstChild);
    }
}

function appendimage(productarray) {
    let hnode = document.createElement("h2");
    hnode.innerHTML = productarray[Math.floor(Math.random()*(productarray.length - 2))].RCP_TTL;
    document.getElementById("results").appendChild(hnode);
}