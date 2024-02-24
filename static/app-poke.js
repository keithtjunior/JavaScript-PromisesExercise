$(document).ready(function() {

    let pokemonSet = new Set();
    let pokemonArr = new Array();
    let randomNumberSet = new Set();
    let randomPokeArr = new Array();
    let pokemonNamesArr = new Array();
    let pokemonDivTextArr = new Array();
    let randomNumberIterator;

    let catchButtonDiv = $('#button-div');
    let pokemonDiv = $('#pokemon-div');

    $(document).on('click', '#get-pokemon', showPokemon);

    // req all pokemon / add to set
    axios.get('https://pokeapi.co/api/v2/pokemon/?limit=2000')
    .then(res => {
        if(res.data.results){
            for (let i in res.data.results) {
                pokemonSet.add(JSON.stringify({name: res.data.results[i].name, 
                    url: res.data.results[i].url}));
            }    
        }
    })
    .then(() => {
        // convert set to array / generate 3 random nums / req 3 pokemon by name iteration
        pokemonSet.forEach(x => pokemonArr.push(JSON.parse(x)));
        randomNumberSet = generateRandomNumbers(3, pokemonArr.length);
        randomNumberIterator = randomNumberSet.values();
        axios.get(`https://pokeapi.co/api/v2/pokemon/${randomNumberIterator.next().value}/`)
        .then((res) => { if(res.data) randomPokeArr.push(res.data) })
        .then(() => reqPokeName() )
        .catch(err => displayErr(err))
    })
    .catch(err => displayErr(err))

    // req pokemon name until randomPokeArr length equals 3
    function reqPokeName(){
        axios.get(`https://pokeapi.co/api/v2/pokemon/${randomNumberIterator.next().value}/`)
        .then((res) => { if(res.data) randomPokeArr.push(res.data) })
        .then(() => { if(randomPokeArr.length < 3) reqPokeName() })
        // .then(() => { if(randomPokeArr.length === 3) console.log(randomPokeArr) })
        .then(() => { 
            if(randomPokeArr.length === 3){
                for (let item of randomPokeArr) {
                    pokemonNamesArr.push({name: item.name, image: item.sprites['front_default']});
                }
            }
            if(pokemonNamesArr.length === 3) reqPokeSpecies(0)
         })
        .catch(err => displayErr(err))
    }

    // req pokemon species until counter reaches 3
    function reqPokeSpecies(i){
        if(i < 3){
            axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonNamesArr[i].name}/`)
            .then((res) => { 
                if(res.data){
                    for (let x in res.data.flavor_text_entries) {
                        if(res.data.flavor_text_entries[x].language.name === 'en'){
                            pokemonDivTextArr.push({name: `${pokemonNamesArr[i].name}`, flavor_text: `${res.data.flavor_text_entries[x].flavor_text}`, image: `${pokemonNamesArr[i].image}`});
                             break;
                        }
                    }
                }
            })
            .then(() => reqPokeSpecies(++i))
            .catch(err => displayErr(err))
        }
        if(i === 3 && pokemonDivTextArr.length === 3) createButton();
    }

    function createButton(){
        catchButton = document.createElement('button');
        catchButton.classList.add('btn', 'btn-warning', 'p-2', 'mb-5');
        catchButton.id = 'get-pokemon';
        catchButton.innerText = "GOTTA CATCH'EM ALL";
        catchButtonDiv.append(catchButton);
    }

    function showPokemon(){
        catchButton.disabled = true;
        for (let item of pokemonDivTextArr) {
            pokemonDiv.append(`<div class="card align-self-stretch mx-2" style="width: 18rem;">
                                <img class="card-img-top" src="${item.image}" alt="${item.name} sprite">
                                    <div class="card-body">
                                        <h5 class="card-title">${item.name}</h5>
                                        <p class="card-text">${item.flavor_text}</p>
                                    </div>
                                </div>`);
        }
    }

    //https://mavtipi.medium.com/how-to-generate-unique-random-numbers-in-a-specified-range-in-javascript-80bf1a545ae7
    function generateRandomNumbers(quantity, max){
        const set = new Set()
        while(set.size < quantity) {
          set.add(Math.floor(Math.random() * max) + 1)
        }
        return set
    }

    function displayErr(err){
        pokemonDiv.append(`<p>${err.message}. Please refresh the page.</p>`)
    }

});

