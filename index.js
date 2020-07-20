const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src ="${imgSrc}" />
            ${movie.Title}`;
    }, inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '45f0aa7f',
                s: searchTerm
            }
        });

        if (response.data.Error) {
            return [];
        }

        return response.data.Search;
    }
}

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'), onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
    }
});
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'), onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
    }
});


let leftMovie;
let rightMovie

const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '45f0aa7f',
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplete(response.data);
    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }
    if (leftMovie && rightMovie) {
        runComparison();
    }
}

const runComparison = () => {
    const leftSideScore = document.querySelectorAll('#left-summary .notification');
    const rightSideScore = document.querySelectorAll('#right-summary .notification');
    leftSideScore.forEach((leftstat,index)=>{
        const rightstat = rightSideScore[index];

        const leftSideValue = leftstat.dataset.value;
        const rightSideValue = rightstat.dataset.value;

        if (rightSideValue>leftSideValue){
            leftstat.classList.remove('is-primary');
            leftstat.classList.add('is-warning');
        }
        else {
            rightstat.classList.remove('is-primary');
            rightstat.classList.add('is-warning');
        }
    })
}

const movieTemplete = movieDetail => {

    const dollars = parseInt((movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')));
    const metaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseFloat(movieDetail.imdbVotes);
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0)
    console.log(awards);
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
    <article data-value="${awards}" class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>    
    </article> 
    <article data-value="${dollars}" class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">BoxOffice</p>    
    </article> 
    <article data-value="${metaScore}" class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>    
    </article> 
    <article data-value="${imdbRating}" class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB rating</p>    
    </article>  
    <article  data-value="${imdbVotes}" class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>    
    </article>  
`;
}
