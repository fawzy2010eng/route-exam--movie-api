'use strict'
let togglebtn = document.querySelector('.togglebtn');
let sideNav = document.querySelector('.sidenav');
let links = document.querySelectorAll('.sidenav a');
togglebtn.addEventListener('click', function () {
    sideNav.classList.toggle('board');
    if (document.querySelector('.sidenav i').classList.contains('fa-bars')) {
        document.querySelector('i').classList.replace('fa-bars', 'fa-xmark')
        for (let i = 0; i < links.length; i++) {
            setTimeout(function () { links[i].style.top = 0 }, i * 170)

        }
    } else {
        document.querySelector('i').classList.replace('fa-xmark', 'fa-bars')
        for (let i = 0; i < links.length; i++) {
            links[i].style.top = '100%'
        }
    }
});


let btnsOfCat = document.querySelectorAll('.sidenav a');
const KeyApi = 'eba8b9a7199efdcb0ca1f96879b83c44&fbclid=IwAR1QJlGsjndAqs28hgVJ5ataqY0Hjyai2CBfPs4CwQzEWWE6kXkx5nTTqoA';
btnsOfCat.forEach(btn => {
    btn.addEventListener('click', function () {

        let cat = this.getAttribute('data-search');
        // console.log(cat);
        if (cat == 'trending') {
            var url = `https://api.themoviedb.org/3/trending/all/day?api_key=eba8b9a7199efdcb0ca1f96879b83c44&fbclid=IwAR3WrYAc1fivbXELNnbyKK2BauDNlW-SUITkFHK9K9tgrkZlI1-Dc9bfzsQ`;

        } else {
            var url = `https://api.themoviedb.org/3/movie/${cat}?api_key=${KeyApi}&language=en-US&page=1`;

        }
        // console.log(url);
        fetch(url)
            .then(response => response.json()
            )
            .then(function (res) {
                console.log(res.results);
                let html = ''
                for (let i = 0; i < res.results.length; i++) {
                    let item = res.results[i];
                    html +=
                        `
                            <div class="overlayed-img p-0 col-md-4 position-relative overflow-hidden">
                                <img class="w-100" src="https://image.tmdb.org/t/p/original/${item.poster_path}" alt="">
                                <div class="overlay d-flex align-items-center justify-content-center flex-column p-2 text-center">
                                    <h2>${item.title}</h2>
                                    <p>${item.overview}</p>
                                    <h4>${item.vote_average}</h4>
                                    <h4>${item.release_date}</h4>
                                </div>

                            </div>     
                        `
                }
                document.querySelector('.movies .row').innerHTML = html;
                // return randitems
            })
    })
})

let inputGlobal = document.querySelector('.search-input-global');
let inputLocal = document.querySelector('.search-input-local');
inputGlobal.addEventListener('keyup', function () {
    let txt = inputGlobal.value;

})






// let item = {"overview":"Doctor Strange, with the help of mystical allies both old and new, traverses the mind-bending and dangerous alternate realities of the Multiverse to confront a mysterious new adversary.",
// "release_date":"2022-05-04",
// "id":453395,
// "adult":false,
// "backdrop_path":"/wcKFYIiVDvRURrzglV9kGu7fpfY.jpg",
// "genre_ids":[14,28,12],
// "vote_count":2915,
// "original_language":"en",
// "original_title":"Doctor Strange in the Multiverse of Madness",
// "poster_path":"/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
// "title":"Doctor Strange in the Multiverse of Madness",
// "video":false,
// "vote_average":7.6,
// "popularity":7647.02,
// "media_type":"movie"}

