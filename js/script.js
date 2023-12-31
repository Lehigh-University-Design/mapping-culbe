
async function loadData() {
    const response = await fetch('data/data.geojson', {
        method: 'GET'
    });

    const data = await response.json();

    mapboxgl.accessToken = 'pk.eyJ1IjoiY3VsYmUiLCJhIjoiY2xubTF3Z25sMXJqZDJzbzJ4eGFjdTRwMSJ9.mQ3GOs7GFeNj30sbiXaj1g&zoomwheel=true&fresh=true#2.66/41.96/-13.71';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/culbe/clod8blvw000401pd6tlsfcxt', // style URL
        interactive: false,
        center: [31.134799, 29.975990], // starting position [lng, lat]
        offset: [50,0],
        zoom: 2, // starting zoom
        bearing: 0,
        pitch: 0
    });

    map.on('load', () => {
        map.addSource('data', {
        type: 'geojson',
        data: data,
        });
        
        map.addLayer({
        'id': 'coffee-region',
        'type': 'circle',
        'source': 'data',
        'layout': {
            'visibility': 'none',
        },
        'paint': {
            'circle-radius': 40,
            'circle-color': 'rgba(0,0,0,0.2)'
        }
        });
        map.flyTo({ //to prevent small shift on intro
            center: [31.134799, 29.975990],
            zoom: 2,
            offset: [50,0],
            essential: true
        });    
    });

    map.scrollZoom.disable();   

    //first and last steps are used to make the side charts disappear because their step will not be active
    // let first_step = document.createElement('div');
    // first_step.setAttribute("class", "step");
    // first_step.setAttribute("id", "dummyID");
    // document.getElementById("article_container").appendChild(first_step);

    first_iter = true;

    for (const item in data.features) {
        const p = data.features[item];

        let div = document.createElement('div');
        div.setAttribute("class", "step");
        div.setAttribute("id", p.id);
        div.setAttribute("data-step", p.id);
        div.setAttribute("data-long", p.geometry.coordinates[0]);
        div.setAttribute("data-lat", p.geometry.coordinates[1]);
        div.setAttribute("data-zoom", p.zoom)
        
        if(first_iter){
            first_iter = false;
        }else{
            var side_chart_div = document.createElement("div");
            side_chart_div.setAttribute("class", "side_img");
            side_chart_div.innerHTML += "Flavor Profile";
            var chart = document.createElement("canvas");
            new Chart(chart, {
                type: 'radar',
                data: {
                labels: ['Acidity', 'Body', 'Fruity', 'Nutty', 'Chocolate', 'Spice'],
                datasets: [{
                    data: [p.acidity, p.body, p.fruit, p.nutty, p.chocolate, p.spice],
                    borderWidth: 2,
                    borderColor: p.color + ')',
                    backgroundColor: p.color + ',0.6)',
                    pointRadius: 2,
                    pointBorderWidth: 0, 
                    pointBackgroundColor: 'rgb(0,0,0)'
                    
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        pointLabels: {
                            color: 'black'
                        },
                        ticks: {
                            display: false,
                        },
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        suggestedMin: 0,
                            suggestedMax: 10
                        }
                    }
                }
            });
            side_chart_div.appendChild(chart);
            div.appendChild(side_chart_div);
        }
        
        // header
        if(p.properties.Title) {
            var header = document.createElement("h2");
            var node = document.createTextNode(p.properties.Title);
            header.appendChild(node);
            div.appendChild(header);
        }

        if(p.img){
            var img = document.createElement("img")
            img.src = p.img
            div.appendChild(img)
        }
        
        // description
        if(p.properties.Description) {
            var description = document.createElement("div");
            description.id = 'description_'+p.id;
            description.className = "description";
            description.innerHTML = p.properties.Description;
            div.appendChild(description);
        }

        
        document.getElementById("article_container").appendChild(div);

    }

    let last_step = document.createElement('div');
    last_step.setAttribute("class", "step");
    document.getElementById("article_container").appendChild(last_step);

    var chart = document.createElement("canvas");
    chart.setAttribute("id", "radar_chart")
    new Chart(chart, {
        type: 'radar',
        data: {
            labels: ['Acidity', 'Body', 'Fruity', 'Nutty', 'Chocolate', 'Spice'],
            datasets: [
                {label: 'Ethiopia',
                data: [data.features[1].acidity, data.features[1].body, data.features[1].fruit, data.features[1].nutty, data.features[1].chocolate, data.features[1].spice],
                borderWidth: 2,
                borderColor: data.features[1].color + ')',
                backgroundColor: data.features[1].color + ',0.6)',
                pointRadius: 4,
                pointBorderWidth: 0, 
                pointBackgroundColor: 'rgb(0,0,0)'
                },
                {label: 'Sumatra',
                data: [data.features[2].acidity, data.features[2].body, data.features[2].fruit, data.features[2].nutty, data.features[2].chocolate, data.features[2].spice],
                borderWidth: 2,
                borderColor: data.features[2].color + ')',
                backgroundColor: data.features[2].color + ',0.6)',
                pointRadius: 4,
                pointBorderWidth: 0, 
                pointBackgroundColor: 'rgb(0,0,0)'
                },                
                {label: 'Hawaii',
                data: [data.features[3].acidity, data.features[3].body, data.features[3].fruit, data.features[3].nutty, data.features[3].chocolate, data.features[3].spice],
                borderWidth: 2,
                borderColor: data.features[3].color + ')',
                backgroundColor: data.features[3].color + ',0.6)',
                pointRadius: 4,
                pointBorderWidth: 0, 
                pointBackgroundColor: 'rgb(0,0,0)'
                },                
                {label: 'Brazil',
                data: [data.features[4].acidity, data.features[4].body, data.features[4].fruit, data.features[4].nutty, data.features[4].chocolate, data.features[4].spice],
                borderWidth: 2,
                borderColor: data.features[4].color + ')',
                backgroundColor: data.features[4].color + ',0.6)',
                pointRadius: 4,
                pointBorderWidth: 0, 
                pointBackgroundColor: 'rgb(0,0,0)'
                },                
                {label: 'Costa Rica',
                data: [data.features[5].acidity, data.features[5].body, data.features[5].fruit, data.features[5].nutty, data.features[5].chocolate, data.features[5].spice],
                borderWidth: 2,
                borderColor: data.features[5].color + ')',
                backgroundColor: data.features[5].color + ',0.6)',
                pointRadius: 4,
                pointBorderWidth: 0, 
                pointBackgroundColor: 'rgb(0,0,0)'
                }                
        
            ]
        },
        options: {
            scales: {
                r: {
                    pointLabels: {
                        color: 'black'
                    },
                    ticks: {
                        display: false,
                    },
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }
        }
    });
    document.getElementById("outro").appendChild(chart);


    // using d3 for convenience
    var main = d3.select("main");
    var scrolly = main.select("#scrolly");
    var figure = scrolly.select("figure");
    var article = scrolly.select("article");
    var step = article.selectAll(".step");

    // initialize the scrollama
    var scroller = scrollama();

    // generic window resize listener event
    function handleResize() {
        // 1. update height of step elements
        var stepH = Math.floor(window.innerHeight * 1.25);
        step.style("height", stepH + "px");

        var figureHeight = window.innerHeight;
        var figureMarginTop = (window.innerHeight - figureHeight) / 2;

        figure
            .style("height", figureHeight + "px")
            .style("top", figureMarginTop + "px");

        // 3. tell scrollama to update new element dimensions
        scroller.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response) {
        console.log(response)

        // add color to current step only
        step.classed("is-active", function (d, i) {
            return i === response.index;
        });

        if(response.element.dataset.long){ //not header/footer step

            map.flyTo({
                center: [response.element.dataset.long, response.element.dataset.lat],
                zoom: response.element.dataset.zoom,
                offset: [50,0],
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });            
            
            // update graphic based on step
            figure.select("p.ind").text(response.index);
        }

        if(response.element.id == "intro_step"){
            map.setLayoutProperty('coffee-region', 'visibility', 'none')
        }else{
            map.setLayoutProperty('coffee-region', 'visibility', 'visible')
        }
    }
        

    function init() {

        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();

        // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller
            .setup({
                step: "#scrolly article .step",
                offset: 0.7,
                debug: false
            })
            .onStepEnter(handleStepEnter);
    }

    // kick things off
    init();

}

loadData();
