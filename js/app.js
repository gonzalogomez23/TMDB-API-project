const form = document.querySelector('.form')
const search = document.querySelector('.search__input')
const genresContainer = document.querySelector(".genres__container")

const prevBtn = document.querySelector('#prevBtn')
const nextBtn = document.querySelector('#nextBtn')
const currentPageTag = document.querySelector('.pagination__current')
let currentPage = 1
/* let nextPage = 2
let prevPage = 3
let lastURL = ''
let totalPages = 100 */

const API_KEY = 'api_key=8445c67332659bc10135ea0451de6ad9'
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL+'/discover/movie?sort_by=popularity.desc&'+API_KEY
const IMG_URL = 'https://image.tmdb.org/t/p/w500/'
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

prevBtn.addEventListener('click', () => {

  if(currentPage > 1){
      currentPage -= 1
      console.log(currentPage)
      getMovies(API_URL+'&page='+currentPage)
  }
  
})

nextBtn.addEventListener('click', () => {

if(currentPage < 1000){
    currentPage += 1
    console.log(currentPage)
    getMovies(API_URL+'&page='+currentPage)
}

})

const genres = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
]

var selectedGenres = []

const setGenre = () => {
  genresContainer.innerHTML = ""
  genres.forEach(genre => {
    const genreTag = document.createElement('div')
    genreTag.classList.add('genre__tag')
    genreTag.id = genre.id
    genreTag.innerText = genre.name

    genreTag.addEventListener('click', () => {
      if(selectedGenres.length == 0){
        selectedGenres.push(genre.id)
      }else{
        if(selectedGenres.includes(genre.id)){
          selectedGenres.forEach((id, index) => {
            if(id == genre.id){
              selectedGenres.splice(index, 1)
            }
          })
        }else{
          selectedGenres.push(genre.id)
        }
      }
      console.log(selectedGenres)
      getMovies(`${API_URL}&with_genres=${encodeURI(selectedGenres.join(','))}`)
      highlightSelection()
    })

    genresContainer.append(genreTag)
  });
}

setGenre()

function highlightSelection() {

  const tags = document.querySelectorAll('.genre__tag')

  tags.forEach(tag =>{
    tag.classList.remove('highlight')
  })
  clearBtn()
  if(selectedGenres.length != 0){
    selectedGenres.forEach(id => {
      const highlightedTag = document.getElementById(id)
      highlightedTag.classList.add('highlight')
    })
  }
}

function clearBtn() {
  let clearBtn = document.getElementById('clear')

  if(clearBtn){
    clearBtn.classList.add('highlight')
  }else{
    let clear = document.createElement('div')
    clear.classList.add('genre__tag', 'highlight')
    clear.id = 'clear'
    clear.innerText = 'Clear x'
    clear.addEventListener('click', () => {
      selectedGenres = []
      setGenre()
      getMovies(API_URL)
    })

    genresContainer.append(clear)
  }
  
}



async function getMovies(url) {
  /* lastURL = url */
  try{
      const response = await fetch(url)

      if(response.status === 200){

          const data = await response.json()
        if(data.results.length !== 0){
          loadMovies(data.results)
          currentPageTag.innerText = currentPage
          if(currentPage <= 1){
            prevBtn.classList.add('pagination__button--disabled')
            nextBtn.classList.remove('pagination__button--disabled')
          }else{
            prevBtn.classList.remove('pagination__button--disabled')
            nextBtn.classList.remove('pagination__button--disabled')
          }




        }else{
          const app = document.querySelector('.movies-container')
          app.innerHTML= `<p class="noresults-text">No results found.</p>`

        }
          
      }else{
          console.log('Something was wrong')
      }
  }catch(error){
      console.log(error)
  } 
}

function loadMovies(data){

  let movies = ''
  const container = document.querySelector('.movies-container')

  data.forEach(movie => {
      movies += 
          `<div class ="movie">
              <div class="poster-container">
                  <img class="poster" src = "${movie.poster_path ? IMG_URL+movie.poster_path : 'img/placeholder.jpg'}">
                  <div class="overview">
                      <p>${movie.overview ? movie.overview : "Sorry, we haven't found any overview for this movie"}</p>
                  </div>
              </div>
              <div class="movie-info">
                  <h3 class="title">${movie.title}</h3>
                  <div class="rating ${getColor(movie.vote_average)}">${movie.vote_average ? movie.vote_average.toFixed(1) : "-"}</div>
              </div>
          </div>`
  });

  container.innerHTML = movies       
}

const getColor = (vote) => {
  if(vote >= 8){
      return "green"
  }else if(vote >= 5){
      return "orange"
  }else{
      return "red"
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const searchTerm = search.value
  
  selectedGenres = []
  setGenre()

  if(searchTerm) {
      getMovies(searchURL+'&query='+searchTerm)
  }
})

const genresTitle = document.querySelector('.genres-title')
const genresArrow = document.querySelector('.genres__arrow')


  genresTitle.addEventListener('click', () =>{
       genresContainer.classList.toggle('display')
       genresArrow.classList.toggle('rotate')
   })

getMovies(API_URL)

/* const pageCall = (page) => {
  let urlSplit 
}

nextBtn.addEventListener('click', () => {

    if(nextPage <= totalPages){
        pageCall(nextPage)
    }
    
}) */
