
const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const infoButtons = [];
const coinCards = [];
const coinInfoCards = [];
const cardsOnToggle = [];
const toggleInputs = [];
const coins1 = [];
const coins2 = [];
const coins3 = [];
let onToggle = 0;
let onMain = true;
$("#reports").hide()
$("#about-div").hide()

const cards = new Promise ((resolve) => {$.ajax(
        {
            method: "GET",
            url: "https://api.coingecko.com/api/v3/coins/list",
            success: (result) => {
                console.log(result)
                result.forEach((obj) => {
                    const card = document.createElement("div");
                    card.style.width = "300px"
                    card.classList.add("card");

                    const cardId = generateRandomId()
                    card.style.flexShrink = "none";

                    card.setAttribute("id", cardId)
                    

                    const div = document.createElement("div");
                    div.classList.add("form-check")
                    div.classList.add("form-switch")

                    const input = document.createElement("input");
                    input.classList.add("form-check-input")
                    input.type = "checkbox";
                    input.style.display = "inline";
                    input.setAttribute("id" , obj.symbol + "Switch");
                    toggleInputs.push({ name: obj.symbol, id: `#${obj.symbol}Switch`})

                    div.appendChild(input);

                    const cardBody = document.createElement("div");
                    cardBody.classList.add("card-body");

                    const cardTitle = document.createElement("h5");
                    cardTitle.classList.add("card-title");
                    cardTitle.style.display="inline";
                    cardTitle.innerText = obj.symbol;

                    const cardText= document.createElement("p");
                    cardText.classList.add("card-text");
                    cardText.innerText = obj.name;

                    
                    const button = document.createElement("button");
                    button.classList.add("btn")
                    button.classList.add("btn-primary")
                    button.innerText = "More info";
                    
                    const buttonId = generateRandomId()
                    button.setAttribute("id" , buttonId); 

                    infoButtons.push({name: obj.symbol, id: buttonId, clicks: 0});
                    
                    const index = infoButtons.map((button) => button.id).indexOf(buttonId);

                    const buttonFunctions = new infoButton(obj.id, index, cardId)
                
                    $(button).click(() => {
                       buttonFunctions.moreInfo()
                    })
            
                    cardBody.appendChild(cardTitle);
                    cardBody.appendChild(div);
                    cardBody.appendChild(cardText);
                    cardBody.appendChild(button);

                    card.appendChild(cardBody);

                    coinCards.push({name: obj.name, id: cardId , card , symbol: obj.symbol})

                   
                })
                resolve(coinCards)

            }
         
        }
        
    )})


cards.then((data) => {
    $("#loading").hide()
    let idEndpoint = 0
    for ( i in data){
        idEndpoint++;
        const cardsDiv = document.getElementById(`coins${idEndpoint}`)
        cardsDiv.appendChild(data[i].card)

        if (idEndpoint === 1){
            coins1.push({symbol: data[i].symbol , id: data[i].id})
        }
        else if (idEndpoint === 2){
            coins2.push({symbol: data[i].symbol , id: data[i].id})
        }
        else{
            coins3.push({symbol: data[i].symbol , id: data[i].id})
            idEndpoint = 0;
        }
    }
    toggleInputs.forEach((toggle) => {
        try{
            const toggleButton = new toggleButtons(toggle.name, toggle.id)
            $(toggle.id).change(function(){
                toggleButton.addNewCoin(toggle.id)
            });
        }
        catch{
            console.log(toggle.id + "cant be used")
        }
     
       
    })
})
let modalOnActive = 0;
let pleaseHelpMe = 2;
class toggleButtons{
    constructor(coinName, toggleId){
        
        this.coinName = coinName;
        this.clicks = 0
        this.toggleId = toggleId;
      
    }

    addNewModel(coin){
        const modalCards = [];
        const modalCardsNames = [];
        const ids = []
        let coinsForModel = `<div style = "padding-left: 60px;">`;
        cardsOnToggle.forEach(coin => {coinsForModel += ` <div> <h6  class = "text-center" style = "display: inline" > ${coin} </h6> <div  style = "display: inline" class="form-check form-switch">
        <input class="form-check-input" id = ${coin +  "SwitchNumber" + pleaseHelpMe} type="checkbox" checked/>
      </div> </div>  <br>`
    
        ids.push(coin)
    
        })
      this.changed = false
      coinsForModel += "</div>"

        const cardModel = `<div class="modal" id = "modal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">please disable at least one of the coins you abled to able ${coin}: </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${coinsForModel}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" id = "saveNumber${pleaseHelpMe}" data-bs-dismiss="modal">Save changes</button>
            </div>
          </div>
        </div>
      </div>`
        $(cardModel).modal("show")


        $("#saveNumber" + pleaseHelpMe.toString()).click(() => {
            const switchTheToggleThatWasChosenAlsoWTFThisNameIsPleaseHelpMe = []
            modalCards.forEach(card => {
                if (card.clicks % 2 === 1){
                    console.log(card.id)
                   
                    switchTheToggleThatWasChosenAlsoWTFThisNameIsPleaseHelpMe.push(card.id)
                   
                }        
            })
            if (switchTheToggleThatWasChosenAlsoWTFThisNameIsPleaseHelpMe.length > 0){
                $("#" + coin + "Switch").prop('checked', true).parent().addClass('active')
                cardsOnToggle.push(coin)
                switchTheToggleThatWasChosenAlsoWTFThisNameIsPleaseHelpMe.forEach(card =>{
                    const coinToggleIndex = cardsOnToggle.indexOf(card)
                    $("#" + card + "Switch").prop('checked', false).parent().removeClass('active')
                    cardsOnToggle.splice(coinToggleIndex, 1)

                })
                console.log(cardsOnToggle)

            }
        })

        ids.forEach(id => { $("#" + id +"SwitchNumber" + pleaseHelpMe ).change(function(){ 
        modalOnActive++;
        if (modalCardsNames.includes(id)){
            modalCards.forEach(card => {
                for(const [key , value] of Object.entries(card)){
                    if (key === "id" && value === id){
                        card.clicks++;
                    }
                }
            })
        }
        else{
            modalCardsNames.push(id);
            modalCards.push({id: id, clicks: 1})
        }
        console.log(modalCards)
        this.changed = true
        onToggle --;     
    })})
        
    pleaseHelpMe++;
  

    }
    addNewCoin(id){
        console.log(this.coinName, cardsOnToggle.indexOf(this.coinName))
        if (cardsOnToggle.indexOf(this.coinName) === -1){
           
       
            console.log(cardsOnToggle)
            onToggle++;
              

            if (cardsOnToggle.length >= 5){
                $(id).prop('checked', false).parent().removeClass('active');
                this.addNewModel(this.coinName)
            }
            else{
                cardsOnToggle.push(this.coinName)
            }
            
        }
        else if (cardsOnToggle.length >= 5){
            if (cardsOnToggle.indexOf(this.coinName) === -1){
                $(id).prop('checked', false).parent().removeClass('active');
                this.addNewModel(this.coinName)
            }
            else{
                const coinIndex = cardsOnToggle.indexOf(this.coinName)
                cardsOnToggle.splice(coinIndex, 1)
                console.log(cardsOnToggle)
                onToggle --;
               
            }
        }
        else{  
            const cardIndex = cardsOnToggle.indexOf(this.coinName);
            cardsOnToggle.splice(cardIndex , 1)
            console.log(cardsOnToggle)
            onToggle --;
        }
        
 
    }
}

class infoButton{
    constructor(coinid, index, cardId){
        this.coinId = coinid
        this.index = index
        this.DadCardId = cardId
    }

    moreInfo(){
        $.ajax({
            method: "GET",
            url: "https://api.coingecko.com/api/v3/coins/" + this.coinId,

            success: (data) => {

                if (infoButtons[this.index].clicks % 2 === 0){


                    $("#" + infoButtons[this.index].id).removeClass("btn-primary")
                    $("#" + infoButtons[this.index].id).addClass("btn-danger")
                    $("#" + infoButtons[this.index].id).html("Less info")

                    
                    const card = document.createElement("div");
                    card.style.width = "280px"
                    card.classList.add("card");

                    const cardId = generateRandomId()
                    this.coinName = data.id
                    this.cardId = cardId;

                    card.setAttribute("id", cardId)
                    coinInfoCards.push({name: data.id, id: cardId})

                    const cardImage = document.createElement("img");
                    cardImage.classList.add("card-img-top")
                    cardImage.classList.add("cardsImg")
                    cardImage.src = data.image.small

                    const cardBody = document.createElement("div");
                    cardBody.classList.add("card-body");

                    const cardText= document.createElement("h5");
                    cardText.classList.add("card-title");
                    cardText.classList.add("text-center");
                    cardText.innerText = `USD: ${data.market_data.current_price.usd}$ \n EUR: ${data.market_data.current_price.eur}€ \n ILS: ${data.market_data.current_price.ils}₪`;
                    
                    card.appendChild(cardImage)
                    card.appendChild(cardBody)
                    card.appendChild(cardText)
                
                    
                    $("#" + this.DadCardId).append(card)

                    infoButtons[this.index].clicks ++;        
                }
                else{
                    $("#" + infoButtons[this.index].id).removeClass("btn-danger")
                    $("#" + infoButtons[this.index].id).addClass("btn-primary")
                    $("#" + infoButtons[this.index].id).html("More info")
                    $("#" + this.cardId).remove()
                    infoButtons[this.index].clicks ++;
                }
            },
            error: () => {
                console.log("there was an error")
            }
        })
    }
}

function generateRandomId(){
    let randomId = "";
    for (i = 0; i < characters.length; i++){
        randomId += characters.charAt(Math.floor(Math.random() * characters.length));
     }

    return randomId  
}

$("#live-reports").click(function () {
    const liveReports = new Promise ( async (resolve) => {
       $("#main").hide()
       $("#about-div").hide()
       $("#reports").hide()
       $("#loading").show()

       onMain = false;
       setTimeout(function(){ $("#loading").hide()
       resolve("iuhbuyg")}, 1500)
       

 
    });
    
    liveReports.then(async function (data){
        if (cardsOnToggle.length <= 0){
            const errorText = `          <div class = "row" style = "margin-top: 20px;">
                        <div class = "col-sm-6 text-center" style = "margin-top: 200px;">
                            <h2> Looks like you didn't toggle any coin :(</h2><br>
                            <button class = "btn btn-dark" id = "back-to-home" >home page</button>
                        </div>
                        <div class = "col-sm-6">
                            <img src = "./images/cloud error.png" />
                        </div>
                    </div>`
            $("#reports").html(errorText)
            $("#reports").show()
            $("#back-to-home").click(function(){
                console.log($(".home-buttons"))
                const home = new Promise ((resolve) => {
                    $("#loading").show()
                    $("#about-div").hide()
                    $("#reports").hide()
                    $("#main").hide()
                    setTimeout(function(){$("#loading").hide()
                    resolve("home page")}, 1500)
                })
                home.then(data => {
                    $("#main").show()
                    onMain = true;
                })
             
            })
            return 
        }
        const coinsObjs  = []
        const coinsGraphsObjs  = []  
        
             
            cardsOnToggle.forEach(async card => {
                const CARD = await coinsToGraphs(card);
                console.log('the coin is', CARD)
        
                CARD.graphObj = {
                    type: "spline",
                    name: CARD.name,
                    showInLegend: true,
                    xValueFormatString: "hh:mm:ss",
                    dataPoints: CARD.datapoints
                }
    
                coinsObjs.push(CARD)
                coinsGraphsObjs.push(CARD.graphObj)
                setInterval(function() {addTime()} , 2000)
            })

        async function addTime(){

            function setNewValues(){
                    coinsObjs.forEach(coin => {
                        $.ajax({
                            url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coin.name}&tsyms=USD`,
                            success: function (data){
                                const now = new Date()
                                for(const [key , value] of Object.entries(data)){
                                    options.data[coinsObjs.indexOf(coin)].dataPoints.push({x: new Date(2016, 07, 0, now.getHours(), now.getMinutes(), now.getSeconds()) , y: value.USD})
                                }
                         
                            }
                        })
                    })
               
                    $("#reports").CanvasJSChart().render();
              
            }

            setNewValues()
    
            
            
        }
        let cardsToShow ="";
        cardsOnToggle.forEach((toggle) => {if (cardsOnToggle.indexOf(toggle) + 1 !== cardsOnToggle.length){cardsToShow += toggle +  ", "}else{cardsToShow += toggle}})

        var options = {
            exportEnabled: true,
            animationEnabled: true,
            title:{
                text: `Live Reports`
            },
            subtitles: [{
                text: `${cardsToShow} to USD`
            }],
            axisX: {
                title: "Time"
            },
            axisY: {
                title: "Coin Value",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: coinsGraphsObjs
        };
        $("#reports").CanvasJSChart(options);
        
        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }
        function coinsToGraphs(coin){
            async function generateCoin(){
                const coinObj =  await createCoin()
                const now = new Date ()
                for(const [key , value] of Object.entries(coinObj)){
                    return {name: coin, value: value.USD, datapoints: [{ x: new Date(2016, 07, 0, now.getHours(),now.getMinutes(), now.getSeconds()),  y: value.USD }]}
                }
                
            }

            function createCoin(){
                return $.ajax({
                    url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coin}&tsyms=USD`,
                    success: function (data){
                        
                        
                    }
            
                }) 
            }

         

            const COIN = generateCoin()
            return COIN
            
            
        }


        $("#reports").show()
     
    
})


})

$("#home-button").click(function(){
    console.log($(".home-buttons"))
    const home = new Promise ((resolve) => {
        $("#loading").show()
        $("#about-div").hide()
        $("#reports").hide()
        $("#main").hide()
        setTimeout(function(){$("#loading").hide()
        resolve("home page")}, 1500)
    })
    home.then(data => {
        $("#main").show()
        onMain = true;
    })
 
})
$("#about").click(function () {
    const about = new Promise ((resolve) => {
        $("#loading").show()
        $("#reports").hide()
        $("#main").hide()
        $("#about-div").hide()
        onMain = false;
        setTimeout(function(){$("#loading").hide()
        resolve("about page")}, 1500)
        
    })
    about.then(data => {
        $("#about-div").show()
    })
 })

$("#search-form").submit(function(e) {
    e.preventDefault();
    if (onMain){
        coins1.forEach(coin => {
            $("#" + coin.id).show()
        })
        coins2.forEach(coin => {
            $("#" + coin.id).show()
        })
        coins3.forEach(coin => {
            $("#" + coin.id).show()
        })
  
        const search = $("#search-text").val();
        coins1.forEach(
            coin => {
                for(const [key , value] of Object.entries(coin)){
                    if (key === "symbol" && !value.includes(search)){
                        $("#" + coin.id).hide()
                    }
                }
            }
        )
        coins2.forEach(
            coin => {
                for(const [key , value] of Object.entries(coin)){
                    if (key === "symbol" && !value.includes(search)){
                        $("#" + coin.id).hide()
                    }
                }
            }
        )
        coins3.forEach(
            coin => {
                for(const [key , value] of Object.entries(coin)){
                    if (key === "symbol" && !value.includes(search)){
                        $("#" + coin.id).hide()
                    }
                }
            }
        )

    }
    else{
        const cardModel = `<div class="modal" id = "modal" tabindex="-1">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">You can only search for a coin in home </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
    
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
            </div>
        </div>`

        $(cardModel).modal("show")

    }
    
    
});