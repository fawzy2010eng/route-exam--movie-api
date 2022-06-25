'use strict';

$('.owl-carousel').owlCarousel({
    loop: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        600: {
            items: 2,
        },
        1000: {
            items: 4,
        }
    }
})

const KeyApi = 'k_mcwk6il6';


// const KeyApi = 'k_1ys8ouur';

var $input = document.getElementById('searchBox');
var baseUrl = "http://sg.media-imdb.com/suggests/";
var $result = document.getElementById('result');
var body = document.getElementsByTagName('body');

$input.addEventListener('keyup', function () {

    //clearing blank spaces from input
    var cleanInput = $input.value.replace(/\s/g, "");

    //clearing result div if the input box in empty
    if (cleanInput.length === 0) {
        $result.innerHTML = "";
    }

    if (cleanInput.length > 0) {

        var queryUrl = baseUrl + cleanInput[0].toLowerCase() + "/"
            + cleanInput.toLowerCase()
            + ".json";
        $.ajax({

            url: queryUrl,
            dataType: 'jsonp',
            cache: true,
            jsonp: false,
            jsonpCallback: "imdb$" + cleanInput.toLowerCase()

        }).done(function (result) {

            //clearing result div if there is a valid response
            if (result.d.length > 0) {
                $result.innerHTML = "";
            }

            for (var i = 0; i < result.d.length; i++) {

                var category = result.d[i].id.slice(0, 2);

                if (category === "tt" || category === "nm") {
                    //row for risplaying one result
                    var resultRow = document.createElement('a');
                    resultRow.setAttribute('class', 'resultRow');
                    var destinationUrl;

                    if (category === "tt") {
                        destinationUrl = "http://www.imdb.com/title/" + result.d[i].id;
                    } else {
                        destinationUrl = "http://www.imdb.com/name/" + result.d[i].id;
                    }

                    resultRow.setAttribute('href', destinationUrl);
                    resultRow.setAttribute('target', '_blank');

                    //creating and setting poster
                    var poster = document.createElement('img');
                    poster.setAttribute('class', 'poster');

                    if (result.d[i].i) {
                        var imdbPoster = result.d[i].i[0];
                        imdbPoster = imdbPoster.replace("._V1_.jpg", "._V1._SX40_CR0,0,40,54_.jpg");
                        var posterUrl =
                            "http://i.embed.ly/1/display/resize?key=798c38fecaca11e0ba1a4040d3dc5c07&url="
                            + imdbPoster
                            + "&height=54&width=40&errorurl=http%3A%2F%2Flalwanivikas.github.io%2Fimdb-autocomplete%2Fimg%2Fnoimage.png&grow=true"
                        poster.setAttribute('src', posterUrl);
                    }

                    //creating and setting description
                    var description = document.createElement('div');
                    description.setAttribute('class', 'description');
                    var name = document.createElement('h4');
                    var snippet = document.createElement('h5');

                    if (category === "tt" && result.d[i].y) {
                        name.innerHTML = result.d[i].l + " (" + result.d[i].y + ")";
                    } else {
                        name.innerHTML = result.d[i].l;
                    }
                    snippet.innerHTML = result.d[i].s;

                    $(description).append(name);
                    $(description).append(snippet);

                    // $(resultRow).append(poster);
                    $(resultRow).append(description);
                    $("#result").append(resultRow);
                }
            }

        });
    }
});
// get random array for 4 movies from 1 to 250
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function getRandomArray(max) {
    let randomArray = [];
    let rand;
    for (let i = 0; i < 10; i++) {
        rand = getRandomInt(max)
        if (!randomArray.includes(rand) && randomArray.length < 4) {
            randomArray.push(rand)
        }
    }
    return randomArray;
}

function getElapsedTime(time) {
    let now = new Date();
    return (Math.floor((now.getTime() - Date.parse(time)) / (60 * 60 * 1000)))
}


function getRandomTopMovies() {
    var url = `https://imdb-api.com/en/API/Top250Movies/${KeyApi}`;
    fetch(url)
        .then(response => response.json()
        )
        //adding the 4 movies to the carousel and the videos
        .then(function (res) {
            let rand = getRandomArray(250);
            let item;
            let randitems = [];
            for (let i = 0; i < 4; i++) {
                item = res.items[rand[i]];
                // console.log(item);
                document.querySelector('.banner .owl-stage').innerHTML +=
                    `
                        <div class="owl-item">
                            <img src= ${item.image} alt="">
                            <div class="txt">
                                <h4>${item.title}</h4>
                                <div class="rate">
                                    <i class="fas fa-star"></i>
                                    ${item.imDbRating}/10
                                </div>
                            </div>
                        </div>      
                    `
                randitems.push(res.items[rand[i]].id);
                document.querySelector('.videos .options').innerHTML +=
                    `
                        <div class="owl-item" data-url = ${item.id}>
                            <img src=${item.image}>
                            <div class="txt">
                                <h4>${item.title}</h4>
                            </div>
                        </div>     
                    `


            }
            return randitems
        })
        ////////////////// adding the first one to the iframe
        .then((res) => {
            let firstmovie = res[0].id
            // console.log(res);
            url = `https://imdb-api.com/en/API/Title/${KeyApi}/${res[0]}/Trailer`;
            fetch(url)
                .then(res => res.json())
                .then(res => {
                    // console.log(res);
                    document.querySelector('.videos iframe').src = res.trailer.linkEmbed;

                })
        })
        ///////////////// adding the event listener to the playlist
        .then(function () {
            let items = document.querySelectorAll('.videos .owl-item');
            items.forEach(item => {
                item.addEventListener('click', function () {
                    url = `https://imdb-api.com/en/API/Title/${KeyApi}/${this.dataset.url}/Trailer`;
                    fetch(url)
                        .then(res => res.json())
                        .then(res => document.querySelector('.videos iframe').src = res.trailer.linkEmbed)
                })
            })
        })

        .catch(err => console.log(err))


}

// tt0910970

function getComingSoon() {
    var url = `https://imdb-api.com/en/API/ComingSoon/${KeyApi}`;
    fetch(url)
        .then(response => response.json()
        )
        .then(function (res) {
            let rand = getRandomArray(10);
            let item;
            for (let i = 0; i < 4; i++) {
                item = res.items[rand[i]];
                document.querySelector('.movies .owl-stage').innerHTML +=
                    `
                    <div class="owl-item">
                            <img src= ${item.image} alt="">
                            <div class="txt">
                                <h4>${item.title}</h4>
                                <div class="rate">
                                    <i class="fas fa-star"></i>
                                    ${item.imDbRating}/10
                                </div>
                            </div>
                        </div>      
                `
            }
        })
        .catch(err => console.log(err))

}

function getPopularShows() {
    var url = `https://imdb-api.com/en/API/MostPopularTVs/${KeyApi}`;
    fetch(url)
        .then(response => response.json()
        )
        .then(function (res) {
            let rand = getRandomArray(10);
            let item;
            for (let i = 0; i < 4; i++) {
                item = res.items[rand[i]];
                document.querySelector('.shows .owl-stage').innerHTML +=
                    `
                    <div class="owl-item">
                            <img src= ${item.image} alt="">
                            <div class="txt">
                                <h4>${item.title}</h4>
                                <div class="rate">
                                    <i class="fas fa-star"></i>
                                    ${item.imDbRating}/10
                                </div>
                            </div>
                        </div>      
                `
            }
        })
        .catch(err => console.log(err))

}
// news api

function getNews() {
    fetch("https://bing-news-search1.p.rapidapi.com/news/search?q=movies&safeSearch=Off&textFormat=Raw&freshness=Day", {
        "method": "GET",
        "headers": {
            "x-bingapis-sdk": "true",
            "x-rapidapi-key": "10354b8ba2msh9e17d9a96b77dd1p161ebajsn002523360166",
            "x-rapidapi-host": "bing-news-search1.p.rapidapi.com"
        }
    })
        .then(res => res.json())
        .then(res => {
            let first = res.value[0];
            document.querySelector('.news .container').innerHTML +=
                `
            <div class="main">
            <img src=${first.image.thumbnail.contentUrl} alt="">
            <div class="txt" >
                <a href=${first.url} target="_blank"><h4>${first.name}</h4><a/>
                <h5>${getElapsedTime(first.datePublished)} hours ago</h5>
                <h6>${first.name}...</h6>
            </div>
            </div>
            <div class="latest">
                <h4>More News On Moluin Rouge</h4>
                <div class="txt">
                    <div>
                        <a href=${res.value[1].url} target="_blank"><h4>${res.value[1].name}</h4><a/>
                        <h6>${getElapsedTime(res.value[1].datePublished)} hours ago</h6>
                    </div>
                    <div>
                        <a href=${res.value[2].url} target="_blank"><h4>${res.value[2].name}</h4><a/>
                        <h6>${getElapsedTime(res.value[2].datePublished)} hours ago</h6>
                    </div>
                    <div>
                        <a href=${res.value[3].url} target="_blank"><h4>${res.value[3].name}</h4><a/>
                        <h6>${getElapsedTime(res.value[3].datePublished)} hours ago</h6>
                    </div>
                    <div>
                        <a href=${res.value[4].url} target="_blank"><h4>${res.value[4].name}</h4><a/>
                        <h6>${getElapsedTime(res.value[4].datePublished)} hours ago</h6>
                    </div>
                    
                    
                </div>
            </div>
            
            
            `
        })
        .catch(err => console.log(err))

}

// rapid api
function getCelebrities() {
    let rand = getRandomArray(10);
    var today = new Date();
    let randIds = [];
    fetch(`https://imdb8.p.rapidapi.com/actors/list-born-today?month=${today.getDate()}&day=${today.getMonth() + 1}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "10354b8ba2msh9e17d9a96b77dd1p161ebajsn002523360166",
            "x-rapidapi-host": "imdb8.p.rapidapi.com"
        }
    })
        .then(res => res.json())
        .then(res => {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 6; j++) {
                    res[rand[i]] = res[rand[i]].slice(1)
                }
                res[rand[i]] = res[rand[i]].slice(0, -1);
                randIds.push(res[rand[i]])
            }
            console.log(randIds);

            return randIds;
        })
        .then(response => {
            response.forEach(res => {
                fetch(`https://imdb8.p.rapidapi.com/actors/get-bio?nconst=${res}`, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": "10354b8ba2msh9e17d9a96b77dd1p161ebajsn002523360166",
                        "x-rapidapi-host": "imdb8.p.rapidapi.com"
                    }
                })
                    .then(res => res.json())
                    .then(res => {
                        console.log(res);
                        document.querySelector('.tops .celeberities').innerHTML += `
                        <div class="cele">
                        <img src= ${res.image.url} alt="">
                        <div class="txt">
                        <h6>${res.name}</h6>
                        <h5></h5>
                        </div>
                        </div>`
                    })
            })
        })
        .catch(err => {
            console.error(err);
        });

}









getRandomTopMovies();
getComingSoon();
getPopularShows();
getNews();
getCelebrities();


let otherHtml = `
<div class="banner">
    <div class="container">
        <div class="social">
            <h3>OUR RECOMMENDATIONS</h3>
            <div class="sub">
                <h4>FOLLOW US:</h4>
                <div class="items">
                    <i class="fab fa-facebook-f"></i>
                    <i class="fab fa-twitter"></i>
                    <i class="fab fa-google-plus-g"></i>
                    <i class="fab fa-youtube"></i>
                </div>
            </div>
        </div>
        <div class="dataShow">
        </div>
    </div>
</div>`


document.querySelector('.navbar-brand').addEventListener('click', function () {
    location.reload()
});

////////// the drop down menues

// the movies drop down
document.querySelector('.header .topMovies').addEventListener('click', function (e) {
    e.preventDefault();
    var url = `https://imdb-api.com/en/API/Top250Movies/${KeyApi}`;
    fetch(url)
        .then(response => response.json()
        )
        .then(res => {
            let items = res.items;
            document.querySelector('.other').innerHTML = otherHtml;
            for (let i = 0; i < 10; i++) {
                let crew = items[i].crew.split(',');
                document.querySelector('.dataShow').innerHTML += `
            <div class="item">
                    <img src=${items[i].image} alt="">
                    <div class="txt">
                        <h4>${i + 1}.</h4>
                        <h2>${items[i].title}</h2>
                        <h2>${items[i].year}</h2>
                        <br>
                        <h6>${items[i].imDbRating}</h6>
                        <br>
                        <a>director</a>
                        <h5>${crew[0]}</h5>|
                        <a>stars</a>
                        <h5>${crew[1]},${crew[2]}</h5>
                    </div>
                </div>
            `



            }

            // ///////////////////////////the evidence i'm mother fucker bitch
            // for (let i = 0; i < 250; i++) {
            //     document.querySelector('.banner .container .owl-stage').innerHTML += `

            //             <div class="owl-item">
            //                 <div class="txt">
            //                     <div class="gener">FANTASY</div>
            //                     <h4>${items[i].title}</h4>
            //                     <div class="rate">
            //                         <i class="fas fa-star"></i>
            //                         7.4/10
            //                     </div>
            //                 </div>

            //             </div>

            //     `
            // }
            // $('.owl-carousel').owlCarousel({
            //     items: 4,
            //     loop: true,
            //     margin: 10,
            //     autoplay: true,
            //     autoplayTimeout: 1000,
            //     autoplayHoverPause: true,
            //     dots: false,
            //     animateOut: 'slideOutUp',
            //     animateIn: 'slideInUp'
            // })










        })


        .catch(err => console.log(err))


});

document.querySelector('.header .popMovies').addEventListener('click', function (e) {
    e.preventDefault();
    var url = `https://imdb-api.com/en/API/MostPopularMovies/${KeyApi}`;
    fetch(url)
        .then(response => response.json()
        )
        .then(res => {
            let items = res.items;


            document.querySelector('.other').innerHTML = otherHtml;
            for (let i = 0; i < 10; i++) {
                let crew = items[i].crew.split(',');
                document.querySelector('.dataShow').innerHTML += `
            <div class="item">
                    <img src=${items[i].image} alt="">
                    <div class="txt">
                        <h4>${i + 1}.</h4>
                        <h2>${items[i].title}</h2>
                        <h2>${items[i].year}</h2>
                        <br>
                        <h6>${items[i].imDbRating}</h6>
                        <br>
                        <a>director</a>
                        <h5>${crew[0]}</h5>|
                        <a>stars</a>
                        <h5>${crew[1]},${crew[2]}</h5>
                    </div>
                </div>
            `
            }
        })
        .catch(err => console.log(err))
});

document.querySelector('.header .comingMovies').addEventListener('click', function (e) {
    e.preventDefault();
    var url = `https://imdb-api.com/en/API/ComingSoon/${KeyApi}`;
    fetch(url)
        .then(response => response.json()
        )
        .then(res => {
            let items = res.items;

            document.querySelector('.other').innerHTML = otherHtml;
            for (let i = 0; i < 10; i++) {
                let crew = items[i].stars.split(',');
                document.querySelector('.dataShow').innerHTML += `
            <div class="item">
                    <img src=${items[i].image} alt="">
                    <div class="txt">
                        <h4>${i + 1}.</h4>
                        <h2>${items[i].title}</h2>
                        <h2>${items[i].year}</h2>
                        <br>
                        <h6>${items[i].imDbRating}</h6>
                        <br>
                        <a>director</a>
                        <h5>${items[i].directors}</h5>|
                        <a>stars</a>
                        <h5>${crew[1]},${crew[2]}</h5>
                    </div>
                </div>
            `



            }


            // ///////////////////////////the evidence i'm mother fucker bitch
            // for (let i = 0; i < 250; i++) {
            //     document.querySelector('.banner .container .owl-stage').innerHTML += `

            //             <div class="owl-item">
            //                 <div class="txt">
            //                     <div class="gener">FANTASY</div>
            //                     <h4>${items[i].title}</h4>
            //                     <div class="rate">
            //                         <i class="fas fa-star"></i>
            //                         7.4/10
            //                     </div>
            //                 </div>

            //             </div>

            //     `
            // }
            // $('.owl-carousel').owlCarousel({
            //     items: 4,
            //     loop: true,
            //     margin: 10,
            //     autoplay: true,
            //     autoplayTimeout: 1000,
            //     autoplayHoverPause: true,
            //     dots: false,
            //     animateOut: 'slideOutUp',
            //     animateIn: 'slideInUp'
            // })
        })


        .catch(err => console.log(err))


});


// the shows dropdown

document.querySelector('.header .topShows').addEventListener('click', function (e) {
    e.preventDefault();
    var url = `https://imdb-api.com/en/API/Top250TVs/${KeyApi}`;
    fetch(url)
        .then(response => response.json()
        )
        .then(res => {
            let items = res.items;
            document.querySelector('.other').innerHTML = otherHtml;
            for (let i = 0; i < 10; i++) {
                let crew = items[i].crew.split(',');
                console.log(items[i]);
                document.querySelector('.dataShow').innerHTML += `
            <div class="item">
                    <img src=${items[i].image} alt="">
                    <div class="txt">
                        <h4>${i + 1}.</h4>
                        <h2>${items[i].title}</h2>
                        <h2>${items[i].year}</h2>
                        <br>
                        <h6>${items[i].imDbRating}</h6>
                        <br>
                        <a>stars</a>
                        <h5>${crew[0]}</h5>
                    </div>
                </div>
            `



            }









        })


        .catch(err => console.log(err))
});

document.querySelector('.header .popShows').addEventListener('click', function (e) {
    e.preventDefault();
    var url = `https://imdb-api.com/en/API/MostPopularTVs/${KeyApi}`;
    fetch(url)
        .then(response => response.json()
        )
        .then(res => {
            let items = res.items;
            document.querySelector('.other').innerHTML = otherHtml;
            for (let i = 0; i < 10; i++) {
                let crew = items[i].crew.split(',');
                document.querySelector('.dataShow').innerHTML += `
            <div class="item">
                    <img src=${items[i].image} alt="">
                    <div class="txt">
                        <h4>${i + 1}.</h4>
                        <h2>${items[i].title}</h2>
                        <h2>${items[i].year}</h2>
                        <br>
                        <h6>${items[i].imDbRating}</h6>
                        <br>
                        <a>stars</a>
                        <h5>${crew[0]}</h5>
                    </div>
                </div>
            `



            }
        })


        .catch(err => console.log(err))
});



// the news drop down
document.querySelector('.header .boxoffice').addEventListener('click', function (e) {
    e.preventDefault();
    var url = `https://imdb-api.com/en/API/BoxOffice/${KeyApi}`;
    fetch(url)
        .then(response => response.json()
        )
        .then(res => {
            let items = res.items;
            document.querySelector('.other').innerHTML = otherHtml;
            for (let i = 0; i < 10; i++) {
                console.log(items[i]);
                // let crew = items[i].crew.split(',');
                document.querySelector('.dataShow').innerHTML += `
            <div class="item">
                    <img src=${items[i].image} alt="">
                    <div class="txt" style="display: flex;
                    align-items: center;">
                        <h4>${i + 1}.</h4>
                        <h2>${items[i].title}</h2>
                        
                    </div>
                </div>
            `



            }
        })


        .catch(err => console.log(err))
});


document.querySelector('.header .topnews').addEventListener('click', function (e) {
    e.preventDefault();
    fetch("https://bing-news-search1.p.rapidapi.com/news/search?q=movies&safeSearch=Off&textFormat=Raw&freshness=Day", {
        "method": "GET",
        "headers": {
            "x-bingapis-sdk": "true",
            "x-rapidapi-key": "10354b8ba2msh9e17d9a96b77dd1p161ebajsn002523360166",
            "x-rapidapi-host": "bing-news-search1.p.rapidapi.com"
        }
    })
        .then(res => res.json())
        .then(response => {
            // console.log(response);
            let items = response.value;

            document.querySelector('.other').innerHTML = otherHtml;
            for (let i = 0; i < 10; i++) {
                let item = items[i];
                console.log(item.url);
                let name = '';
                if (item.name.length > 22) {
                    name = item.name.slice(0, 52).concat('...');
                }
                document.querySelector('.dataShow').innerHTML += `
                <div class="item">
                        <img src=${item.image.thumbnail.contentUrl} alt="">
                        <div class="txt" style="display: flex;
                        align-items: center;">
                            <h4>${i + 1}. </h4>
                            <a href=${item.url} target="_blank"><h2>${name}</h2></a>
                        </div>
                    </div>
                `



            }






        })
        .catch(err => {
            console.error(err);
        });
});