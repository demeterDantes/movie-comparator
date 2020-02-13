const autoCompleteConfig ={
    
    renderOption(movie){
         //hidde the user message
         document.querySelector('.tutorial').classList.add('is-hidden');
       
        //ternry operator to cheak the poster
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        // form a multi line string ``
        // inject a javascript variable  into a string formed with tactics. we use $
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;

    },
    
    inputValue(movie){
        return movie.Title;
    },
    //making reguest to fetch data with axios and async await
    async fetchData (searchTerm){
        const response = await axios.get('http://www.omdbapi.com', {
            params:{
                apikey:'b752778b',
                s:searchTerm
            }
        });
    
        //if any content dont match return an empty array
        if(response.data.Error){
            return [];
        }
    
        //return an array of movies data
        return response.data.Search;
    }
};

createAutoComplete({
    //make a copy ofeverything inside of the object
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'), 
    summary:document.querySelector('#left-summary'), 
    onOptionSelect(movie){ 
        //update the content with the selected movie
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
        
    },
    
});

createAutoComplete({
    
    ...autoCompleteConfig,
    
    root: document.querySelector('#right-autocomplete'), 
    summary:document.querySelector('#right-summary'), 
    onOptionSelect(movie){
        //update the content with the selected movie
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
    
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) =>{
    const response = await axios.get('http://www.omdbapi.com', {
        params:{
            apikey:'b752778b',
            i: movie.imdbID
        }
    });
   summaryElement.innerHTML = movieTemplate(response.data);

   //capture data into variables for comparison
   if(side === 'left'){
       leftMovie = response.data;
   }else{
       rightMovie = response.data;
   }
   //if vars define
   if(leftMovie && rightMovie){
       runComparison();
   }
};

const runComparison = () =>{
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) =>{
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if(rightSideValue>leftSideValue){
            leftStat.classList.remove('is-success');
            leftStat.classList.add('is-warning');

        }else{
            rightStat.classList.remove('is-success');
            rightStat.classList.add('is-warning');
        }

    });
};

const movieTemplate = movieDetail =>{

    //remove spacial characters from a str and turn it into a number
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbrating = parseFloat(movieDetail.imdbRating);
    const imdbvotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split('').reduce((prev, word) =>{
        const value = parseInt(word);
        if(isNaN(value)){
            return prev;
        }else{
           return prev + value;
        }
    }, 0);

    //return html content about movie details
    //classes comes from bulma
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-success">
            <p class="title">${movieDetail.Awards}</p>.
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-success">
            <p class="title">${movieDetail.BoxOffice}</p>.
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-success">
            <p class="title">${movieDetail.Metascore}</p>.
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbrating} class="notification is-success">
            <p class="title">${movieDetail.imdbRating}</p>.
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbvotes} class="notification is-success">
            <p class="title">${movieDetail.imdbVotes}</p>.
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};