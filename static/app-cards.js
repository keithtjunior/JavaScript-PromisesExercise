$(document).ready(function() {

    const shuffleDeckURL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
    let deckId0 = '';
    let deckId1 = '';
    let cardImg = '';

    let buttonDiv = $('#button-div');
    let cardsDiv = $('#cards-div');
    let errDiv = $('#error-div');
    let getCardBtn;

    $(document).on('click', '#get-card', getCard);

    axios.get(shuffleDeckURL)
    .then(res => {
        deckId0 = res.data.deck_id;
    })
    .then(() => {
        // log first card
        axios.get(`https://deckofcardsapi.com/api/deck/${deckId0}/draw/?count=1`)
        .then(res => {
            console.log(`${res.data.cards[0].value} of ${res.data.cards[0].suit}`)
        })
        .catch(err => displayErr(err))
    })
    .then(() => {
        // log second card
        axios.get(`https://deckofcardsapi.com/api/deck/${deckId0}/draw/?count=1`)
        .then(res => {
            console.log(`${res.data.cards[0].value} of ${res.data.cards[0].suit}`)
        })
        .catch(err => displayErr(err))
    })
    .then(() => {

        // start drawing cards for button interaction
        axios.get(shuffleDeckURL)
        .then(res => {
            deckId1 = res.data.deck_id;
        })
        .then(() => {
            // load button
            createButton();
        })
        .then(() => {
            // get first card for display
            axios.get(`https://deckofcardsapi.com/api/deck/${deckId1}/draw/?count=1`)
            .then(res => {
                cardImg = res.data.cards[0].image;
                if(cardImg) getCardBtn.disabled = false;
            })
            .catch(err => displayErr(err))
        })
        .catch(err => displayErr(err))

    })
    .catch(err => displayErr(err));


    // display card and request next
    function getCard(){
        //https://stackoverflow.com/questions/13455042/random-number-between-negative-and-positive-value
        let randomNum = Math.ceil(Math.random() * 12) * (Math.round(Math.random()) ? 1 : -1);
        cardsDiv.append(`<div class="card-img"><img src="${cardImg}" style="transform: rotate(${randomNum}deg);"></div>`);
        cardImg = null;
        getCardBtn.disabled = true;
        axios.get(`https://deckofcardsapi.com/api/deck/${deckId1}/draw/?count=1`)
        .then(res => {
            if(res.data.success){
                cardImg = res.data.cards[0].image;
                getCardBtn.disabled = false;
            }
        })
        .catch(err => displayErr(err))
    }

    function createButton(){
        getCardBtn = document.createElement('button');
        getCardBtn.classList.add('btn', 'btn-secondary', 'p-3');
        getCardBtn.id = 'get-card';
        getCardBtn.innerText = 'Give me a card!';
        getCardBtn.disabled = true;
        buttonDiv.append(getCardBtn);
    }

    function displayErr(err){
        errDiv.append(`<p>${err.message}. Please refresh the page.</p>`)
    }


});




