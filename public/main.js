// Focus div based on nav button click

/*functions that is used in onclick in index.html to highlight and de-select
 other buttons in the navbar*/ 
function homeNav() {
    document.getElementById("homenav").className = "active";
    document.getElementById("home").className = "active";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  function singleNav() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "active";
    document.getElementById("single").className = "active";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  function multiNav() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "active";
    document.getElementById("multi").className = "active";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  function guessNav() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "active";
    document.getElementById("guesscoin").className = "active";
  } 

// Flip one coin and show coin image to match result when button clicked
const coin = document.getElementById("coin")

//coin listens for click in index.html
coin.addEventListener("click", flipCoin)

async function flipCoin(){
    const endpoint = '/app/flip'

    const url = document.baseURI+endpoint

    await fetch(url)

    .then(function(response) {
        return response.json()
    })

    .then(function(result) {
        console.log(result)
        document.getElementById("result").innerHTML = result.flip
        document.getElementById("quarter").setAttribute("src", "assets/img/"+result.flip+".png")
      });
}

// make coins 
const coins = document.getElementById("coins")

//listener to flip coins when submit is clicked in index.html 
coins.addEventListener("submit", flipCoins)

async function flipCoins(){
    const endpoint = '/app/flip/coins/'

    const url = document.baseURI+endpoint 

    const formEvent = event.currentTarget
    
    try{
        const formData = new FormData(formEvent)

        const flips = await sendFlips({ url, formData });

        console.log(flips)

        document.getElementById("heads").innerHTML = "Heads: "+flips.summary.heads;
		    document.getElementById("tails").innerHTML = "Tails: "+flips.summary.tails;

        document.getElementById("coinlist").innerHTML = coinList(flips.raw)
    } catch(e){
      console.log(e)
    }
}

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button
