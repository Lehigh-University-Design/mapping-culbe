
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
        'id': 'location-layer',
        'type': 'circle',
        'source': 'data',
        //this is for the map marker
        'paint': {
        'circle-radius': 3,
        'circle-stroke-width': 1,
        'circle-color': 'black',
        'circle-stroke-color': 'black'
        }
        });
    });

    map.scrollZoom.disable();

    for (const item in data.features) {
        const p = data.features[item];

        let div = document.createElement('div');
        div.setAttribute("class", "step");
        div.setAttribute("id", p.id);
        div.setAttribute("data-step", p.id);
        div.setAttribute("data-long", p.geometry.coordinates[0]);
        div.setAttribute("data-lat", p.geometry.coordinates[1]);
        div.setAttribute("data-zoom", p.zoom)
        
        var side_chart_div = document.createElement("div");
        side_chart_div.setAttribute("class", "side_img");
        var chart = document.createElement("canvas");
        new Chart(chart, {
            type: 'radar',
            data: {
              labels: ['Acidity', 'Body', 'Fruity', 'Nutty', 'Chocolate', 'Spice'],
              datasets: [{
                data: [p.acidity, p.body, p.fruit, p.nutty, p.chocolate, p.spice],
                borderWidth: 1
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
                        angleLines: {
                            display: false
                        },
                        suggestedMin: 0,
                        suggestedMax: 10
                    }
                }
            }
        });
        side_chart_div.appendChild(chart);
        div.appendChild(side_chart_div);

        // header
        if(p.properties.Title) {
            var header = document.createElement("h2");
            var node = document.createTextNode(p.properties.Title);
            header.appendChild(node);
            div.appendChild(header);
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
        map.flyTo({
            center: [response.element.dataset.long, response.element.dataset.lat],
            zoom: response.element.dataset.zoom,
            offset: [50,0],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });

        // add color to current step only
        step.classed("is-active", function (d, i) {
            return i === response.index;
        });

        // update graphic based on step
        figure.select("p.ind").text(response.index);
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