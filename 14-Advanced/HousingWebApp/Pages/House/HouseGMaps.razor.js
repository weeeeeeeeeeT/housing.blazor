var gmap;
var infoWindow;

(g => {
    var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
})({
    key: gmap_key,
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
});

export async function initMap(lat = -34.397, lon = 150.644, zoom = 10) {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
        "marker",
    );
    let node = document.getElementById("gmap");
    if (node) {
        gmap = new Map(node, {
            center: { lat: lat, lng: lon },
            zoom: zoom,
            mapId: "HousingWebApp",
        });

        infoWindow = new google.maps.InfoWindow();
    }
}

export async function show_houses(houses) {
    console.log(houses);
    for (var i = 0; i < houses.length; i++) {
        let house = houses[i];
        let address = house.address;
        var latLng = new google.maps.LatLng(address.lat, address.longt);

        //var marker = new google.maps.Marker({
        //     position: latLng,
        //     map: gmap,
        //     title: house.info
        // });

        //const iconImage = document.createElement("img");
        //iconImage.src = "https://maps.gstatic.com/mapfiles/ms2/micons/homegardenbusiness.png";
        var marker = new google.maps.marker.AdvancedMarkerElement({
            position: latLng,
            map: gmap,
            title: house.info,
            // content: iconImage
        });
        var contentString = `
            <div class="card h-100 shadow-sm border-0 house-card" style="max-width: 300px; border-radius: 1rem;">
                <img src="${house.houseImages.mainImage}" alt="House Image" class="card-img-top" style="max-height: 200px; object-fit: cover; border-top-left-radius: 1rem; border-top-right-radius: 1rem;">
                <div class="card-body d-flex flex-column" style="padding: 1.5rem;">
                    <h5 class="card-title">${house.info}</h5>
                    <p class="card-text mb-1"><strong>Price:</strong> ${house.price}$</p>
                    <p class="card-text mb-1"><strong>Square Root:</strong> ${house.sqrRoot}</p>
                    <p class="card-text mb-1"><strong>Address:</strong> ${house.address.toString()}</p>
                    <p class="card-text mb-1"><strong>Owner:</strong> <a href="mailto:${house.appUser.email}">${house.appUser.lastName}, ${house.appUser.firstName}</a></p>
                    <div class="mt-auto">
                        <a href="/house/${house.id}" class="btn btn-primary me-2">Details</a>
                        <button class="btn btn-secondary" onclick="openGMaps(${house.id})">Go to Map</button>
                    </div>
                </div>
            </div>`;

        makeInfoWindow(gmap, infoWindow, contentString, marker);
    }
}
export function makeInfoWindow(map, infowindow, contentString, marker) {
    google.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });
}