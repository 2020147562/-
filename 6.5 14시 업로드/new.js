    let counter = 0
    let feeling = "All";
    let purpose = "";
    let products;
    let person;
    let number;
    let recomarray;
    let cookingmethod;
    let allergy;
    let mbtiM;
    let mbtiB;
    let mbtiT;
    let mbtiI;

    let recipe1;
    let recipe2;
    let recipe3;





    /*fetch("person.json")
        .then(response => response.json())
        .then(json => {
            person = json;
            showprofile();
        })
        .catch(err => { console.log(err) });*/



    fetch('/get_logined_user_profile', {
        method: 'POST',
    })
    .then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("유저 프로필 정보 로드 실패");
    }
    })
    .then(data => {
        person = data;
        fetch("/recipe2.json", {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            products = json;
            showprofile();
        })
        .catch(err => { console.log(err) });   
        })
    .catch(error => {
    console.log("유저 프로필 정보 로드 실패");
    });


    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("recommend").addEventListener("click", setSearchOption, false);
    });            

    // 레시피에 해당하는 추천 버튼을 누르면 해당 레시피의 이름을 전달하여 sendRecipeName을 통해 서버에 전달
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("recommend").addEventListener("click", function() {
            document.getElementById("button1").addEventListener("click", function() {
                sendRecipeName(recipe1);
            }, false);
        })      
    });
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("recommend").addEventListener("click", function() {
            document.getElementById("button2").addEventListener("click", function() {
                sendRecipeName(recipe2);
            }, false);
        })
    });
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("recommend").addEventListener("click", function() {
            document.getElementById("button3").addEventListener("click", function() {
                sendRecipeName(recipe3);
            }, false);
        })
    });

    // 서버로 레시피 이름 전송
    function sendRecipeName(recipeName) {
        window.location.href = "http://localhost:50000/reviewPage.html";
        // let recipe = {"recipeName": recipeName};
        // fetch("/recipeName.json", {
        //     method: "POST",
        //     headers: {
        //     'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(recipe)
        // })
        // .then(response => response.json())
        // .catch(err => { console.log(err) })
        // .finally(() => {
        //     window.location.href = "http://localhost:50000/share.html";
        // })
    }

    function showprofile() {
        let namenode = document.createElement("h4");
        let mbtinode = document.createElement("h4");
        let divnode = document.createElement("div");
        cookingmethod = person.cookingMethods;
        allergy = person.allergens;
        mbtiM = person.mbti.riceOrWheat;
        mbtiB = person.mbti.skillLevel;
        mbtiT = person.mbti.isVegeterain;
        mbtiI = person.mbti.speed;
        namenode.innerHTML = person.nickname;
        mbtinode.innerHTML = showMBTI(); 
        document.getElementById("checkmypro").appendChild(divnode);
        divnode.appendChild(namenode);
        divnode.appendChild(mbtinode);
    }

    function showMBTI() {
        let m, b, t, i;
        if(mbtiM == "rice") {
            m = "R";
        }
        else {
            m = "W";
        }
        if(mbtiB == "high") {
            b = "H";
        }
        else {
            b = "L";
        }
        if(mbtiT == "yes") {
            t = "Y";
        }
        else {
            t = "N";
        }
        if(mbtiI == "fast") {
            i = "F";
        }
        else {
            i = "S";
        }
        return m + b + t + i;
    }

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
                    if(products[d].CKG_MTH_ACTO_NM.includes(cookingmethod)) {
                        filteringRest(recomarray, products[d]); 
                    }
                }
            }
        }  
        appendimage(recomarray);
    }

    function loadfilter2() {
        for(let e in products) {
            if(products[e].RCP_TTL.includes("매콤") || products[e].CKG_IPDC.includes("매콤")) {
                if(products[e].CKG_STA_ACTO_NM.includes(purpose)) {
                    if(products[e].CKG_MTH_ACTO_NM.includes(cookingmethod)) {
                        filteringRest(recomarray, products[e]); 
                    } 
                }
            }
        }
        appendimage(recomarray);
    }

    function loadfilter3() {
        for(let f in products) {
            if(products[f].CKG_STA_ACTO_NM.includes(purpose)) {
                if(products[f].CKG_MTH_ACTO_NM.includes(cookingmethod)) {
                    filteringRest(recomarray, products[f]); 
                }  
            }
        }
        appendimage(recomarray);
    }

    function filteringRest(realArray, realProduct) {
        if(!realProduct.CKG_INBUN_NM.includes(allergy)) {
            if(mbtiM == "rice") {
                if(!realProduct.CKG_MTRL_ACTO_NM.includes("밀")) {
                    mbtiBB(realArray, realProduct);
                }
            }
            else {
                if(!realProduct.CKG_KND_ACTO_NM.includes("밥")) {
                    mbtiBB(realArray, realProduct);
                }
            }
        }
    }

    function mbtiBB(realA, realP) {
        if(mbtiB == "high") {
            if(realP.CKG_DODF_NM.includes("중급") || realP.CKG_DODF_NM.includes("고급")) {
                mbtiTT(realA, realP);
            }
        }
        else {
            if(realP.CKG_DODF_NM.includes("초급")) {
                mbtiTT(realA, realP);
            }
        }
    }
    function mbtiTT(realA, realP) {
        if(mbtiT == "yes") {
            if(!realP.CKG_MTRL_CN.includes("고기")) {
                mbtiII(realA, realP);
            }
        }
        else {
            mbtiII(realA, realP);
        }
    }
    function mbtiII(realA, realP) {
        if(mbtiI == "fast") {
            if(realP.CKG_TIME_NM.includes("15분") || realP.CKG_TIME_NM.includes("30분") || realP.CKG_TIME_NM.includes("10분")) {
                realA.push(realP);
            }
        }
        else {
            if(!(realP.CKG_TIME_NM.includes("15분") || realP.CKG_TIME_NM.includes("30분") || realP.CKG_TIME_NM.includes("10분"))) {
                realA.push(realP);
            }    
        }
    }


    function clearimage() {
        let image = document.getElementById("results");
        while(image.hasChildNodes()) {
            image.removeChild(image.firstChild);
        }
    }

    function appendimage(productarray) {
        let newImage = document.createElement("img");
        let newdiv1 = document.createElement("div");
        let newdiv2 = document.createElement("div");
        let newdiv3 = document.createElement("div");
        let hnode1 = document.createElement("h2");
        let hnode2 = document.createElement("h2");
        let hnode3 = document.createElement("h2");
        let newHref1 = document.createElement("a");
        let newHref2 = document.createElement("a");
        let newHref3 = document.createElement("a");

        let button1 = document.createElement("button");
        let button2 = document.createElement("button");
        let button3 = document.createElement("button");

        button1.innerHTML = "리뷰 작성하기";
        button1.id = "button1";
        button1.class = "recommendbutton"
        button2.innerHTML = "리뷰 작성하기";
        button2.id = "button2";
        button2.class = "recommendbutton"
        button3.innerHTML = "리뷰 작성하기";
        button3.id = "button3";
        button3.class = "recommendbutton";

        let random_num1 = Math.floor(Math.random()*(productarray.length - 1));
        let random_num2 = Math.floor(Math.random()*(productarray.length - 1));
        let random_num3 = Math.floor(Math.random()*(productarray.length - 1));
        recipe1 = productarray[random_num1].RCP_TTL;
        hnode1.innerHTML = recipe1 + (productarray.length - 1);
        newHref1.innerHTML = "상세레시피 링크";
        newHref1.setAttribute("href", "https://www.10000recipe.com/recipe/" + productarray[random_num1].RCP_SNO);

        recipe2 = productarray[random_num2].RCP_TTL;
        hnode2.innerHTML = recipe2 + (productarray.length - 1);
        newHref2.innerHTML = "상세레시피 링크";
        newHref2.setAttribute("href", "https://www.10000recipe.com/recipe/" + productarray[random_num2].RCP_SNO);

        recipe3 = productarray[random_num3].RCP_TTL
        hnode3.innerHTML = recipe3 + (productarray.length - 1);
        newHref3.innerHTML = "상세레시피 링크";
        newHref3.setAttribute("href", "https://www.10000recipe.com/recipe/" + productarray[random_num3].RCP_SNO);
        document.getElementById("results").appendChild(newdiv1);
        document.getElementById("results").appendChild(newdiv2);
        document.getElementById("results").appendChild(newdiv3);
        newdiv1.appendChild(newHref1);
        newdiv1.appendChild(hnode1);
        newdiv1.appendChild(button1);
        newdiv2.appendChild(newHref2);
        newdiv2.appendChild(hnode2);
        newdiv2.appendChild(button2);  
        newdiv3.appendChild(newHref3);
        newdiv3.appendChild(hnode3);
        newdiv3.appendChild(button3);

    }