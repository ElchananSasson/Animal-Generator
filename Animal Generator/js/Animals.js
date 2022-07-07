$(document).ready(function () {
    getDate();
    let animals_data = [];
    $("button").click(function () {
        let url = 'https://zoo-animal-api.herokuapp.com/animals/rand/' + $(this).text();
        console.log(url);
        $.ajax({
            url: url,
            type: 'GET',
            datatype: 'json',
            success: function (response) {
                animals_data = response;
                createTable(response);
                $('.animal-details').html("");
            },
            error: function () {
                console.log('ERROR: Ajax call');
                $(".animals").html("<div class='error-animal'><h1>ERROR!<h1><h2>refresh the page please...</h2></div>");
            }
        });
    });

    // This function return the current day.
    function getDate() {
        $.ajax({
            url: 'src/get_current_date.php',
            type: 'GET',
            success: function (response) {
                $("#date").html(response);
            },
            error: function (response) {
                $("#date").html("error");
                console.log('ERROR: Ajax call');
            }
        });
    }
    // This function puts the images of the animals and their names on the screen.
    function createTable(data) {
        let x = $(".animals")
        x.html("");
        for (let i = 0; i < data.length; i++) {
            let src = `<div class='photo')>
            <img src=${data[i].image_link}><br>${data[i].name}</div>`
            x.append(src);
        }
    }

    // When clicked on an image of an animal we get details about her.
    $('.animals').on('click', 'img', function () {
        let i;
        for (i = 0; i < animals_data.length; i++) {
            if (animals_data[i].image_link == this.src) break;
        }
        let min_len = ((animals_data[i].length_min !== undefined) ? animals_data[i].length_min * 0.3048 : "");
        let max_len = ((animals_data[i].length_max !== undefined) ? animals_data[i].length_max * 0.3048 : "");
        let min_weight = ((animals_data[i].weight_min !== undefined) ? animals_data[i].weight_min * 0.45359237 : "");
        let max_weight = ((animals_data[i].weight_max !== undefined) ? animals_data[i].weight_max * 0.45359237 : "");
        let details = "<div class='details'>";
        details += "<h3>" + ((animals_data[i].name !== undefined) ? animals_data[i].name : "") + "</h3>";
        details += "1. Family: " + ((animals_data[i].animal_type !== undefined) ? animals_data[i].animal_type : "") + ".<br>";
        details += "2. Diet: " + ((animals_data[i].diet !== undefined) ? animals_data[i].diet : "") + ".<br>";
        details += "3. Lifespan: " + ((animals_data[i].lifespan !== undefined) ? animals_data[i].lifespan : "") + " years.<br>";
        details += "4. Min length: " + min_len.toFixed(2) + "m.<br>";
        details += "5. Max length: " + max_len.toFixed(2) + "m.<br>";
        details += "6. Min weight: " + min_weight.toFixed(2) + "Kg.<br>";
        details += "7. Max weight: " + max_weight.toFixed(2) + "Kg.<br>";

        let wvv = weekly_viki_views(animals_data[i].name);
        if (wvv != undefined) {
            details += "8. Weekly views on Wikipedia: " + wvv + ".</div>";
        } else {
            details += "8. Weekly views on Wikipedia: </div>"
        }
        $('.animal-details').html(details);
    });

    // Scrolling down to the details when you click on the animal.
    $('.animals').on('click', 'img', function () {
        $('html,body').animate({
            scrollTop: $(".animal-details").offset().top},
            'fast');
    });

    // This function returns the number of views in the last week on Wikipedia about the selected animal.
    function weekly_viki_views(name) {
        let url = "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/" + name + "/daily/";
        let date = new Date(), last_week = new Date(Date.now() - 604800000);
        url += last_week.getFullYear() + ((last_week.getMonth() + 1) < 10 ? "0" : "") + (last_week.getMonth() + 1);
        url += ((last_week.getDate()) < 10 ? "0" : "") + last_week.getDate() + "/"; 
        url += date.getFullYear() + ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
        url += (date.getDate() < 10 ? "0" : "") + date.getDate();
        console.log(url);
        let wv;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            'async': false,
            success: function (response) {
                console.log(response);
                wv = response.items.reduce((total, day) => total + day.views, 0);
            },
            error: function () {
                console.log("Ajax error");
            }
        });
        return wv;
    }
});