$(document).ready(function() {

    const favNumberURL = 'http://numbersapi.com/7?json';
    const multiNumberURL = 'http://numbersapi.com/1..10';
    const fourFacts = [];

    let favNumCard = $('#favorite-number');
    let multiNumList = $('#multiple-numbers');
    let fourNumsList = $('#four-facts');

    axios.get(favNumberURL)
    .then(res => {
        favNumCard.text(res.data['text'])
    })
    .catch(err => {
        favNumCard.text(displayErrorMsg(err))
    });

    axios.get(multiNumberURL)
    .then(res => {
        for (let i in res.data) {
            multiNumList.append(`<li class="list-group-item">${res.data[i]}</li>`)
        }
    })
    .catch(err => {
        multiNumList.append(`<li class="list-group-item">${displayErrorMsg(err)}</li>`)
    });

    displayFacts();

    function displayFacts(){
        axios.get(favNumberURL)
        .then(res => {
            if(fourFacts.length <= 4){
                fourFacts.push(res.data['text']);
                displayFacts();
            }
            return;
        })
        .then(res => {
            if(fourFacts.length === 4){
                for (let fact of fourFacts) {
                    fourNumsList.append(`<li class="list-group-item">${fact}</li>`);
                } 
            }
            return;
        })
        .catch(err => {
            favNumCard.text(`<li class="list-group-item">${displayErrorMsg(err)}</li>`)
        });
    }

    function displayErrorMsg(err){
        return `Error: ${err.message}. Try Refreshing your page.`
    }

});




