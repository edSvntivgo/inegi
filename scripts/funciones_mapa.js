function inicializa() {
    construccionLista();
    var zoomI = 10;
    var latI = 23.84;
    var lngI = -102.18;
    var myOptions = {
        center: new google.maps.LatLng(latI, lngI), zoom: zoomI
    };
    for (var i = 0; i < geeServerDefs.layers.length; i++) {
        geeServerDefs.layers[i].initialState = false;
        // obtiene los datos del inpput para la busqueda
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        gmap.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        //obtiene los datos del input y empiesa a usar google place para el auto completado
        searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

          if (places.length == 0) {
            return
          }
          
          var bounds = new google.maps.LatLngBounds();
        
          places.forEach(function(place) {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
            var image='img/pin.png';
              var markers=locations.map(function(location,i){
              return new google.maps.Marker({
                position:location,
                icon:image,
                animation: google.maps.Animation.DROP,
              });
            });

            var markerCluster = new MarkerClusterer(map, markers,{imagePath:'http://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

          });
          map.fitBounds(bounds);
        });
    }
    gmap = new GFusionMap("map_canvas", geeServerDefs, myOptions);
    

}

var codHtml = '';
function construccionLista() {
    codHtml += '<table>';
    crearListado(listadoCapas, 0);
    console.log(listadoCapas);
    codHtml += '</table>';
    document.getElementById('divLista').innerHTML = codHtml;
}

function crearListado(lista, num) {
    var tot = 0
    tot += num;
    var isfolder = false;
	var viewIdLayer = '';
    for (var i = 0; i < lista.layers.length; i++) {
        var btn = '<input type="checkBox" onclick="enciendeApagaCapa(\'' + lista.layers[i].id + '\');">';
        if (lista.layers[i].isFolder) {
            btn= '';
            isfolder = true;
        }
		else 
		{
			viewIdLayer = ' ('+lista.layers[i].id+')';
		}
        codHtml += '<tr><td class="' + lista.layers[i].id + '" style="padding-left:' + tot + 'px;">' + btn + lista.layers[i].label + viewIdLayer + '</td></tr>'
        if (isfolder) {
            crearListado(lista.layers[i], tot + 15, lista.layers[i].id);
        }
    }
}

function enciendeApagaCapa(layerId) {
	layerId= '0-'+layerId;
    if (gmap.isFusionLayerVisible(layerId)) {
        gmap.hideFusionLayer(layerId);
    }
    else {
        gmap.showFusionLayer(layerId);
    }
}

var listadoCapas = {
	// A continuación se crean las filas de capas que se visualizarán en la lista para activar o desactivar del mapa. 
	// Como ejemplo se agregan tres de ellas.
	// Agrega todas las capas que necesites.
    "version": "03s12i20u14l",
    "layers": [
	
      {
          "id": "02",
          "label": "División territorial",
          "isFolder": true,
          "state": false,
          "layers": [
            {
				  "id": 1162,
				  "initialState": true,
				  "label": "Estatal",
				  "lookAt": "none",
				  "opacity": 2,
				  "requestType": "VectorMapsRaster",
				  "version": 29
			  },
			  {
				  "id": 1163,
				  "initialState": true,
				  "label": "Municipal",
				  "lookAt": "none",
				  "opacity": 2,
				  "requestType": "VectorMapsRaster",
				  "version": 28
			  },
			  {
					"icon": "icons/ico_manzanasU_l.png",
					"id": 1166,
					"initialState": false,
					"isPng": true,
					"label": "Colonias",
					"lookAt": "none",
					"opacity": 2,
					"requestType": "VectorMapsRaster",
					"version": 26
			  }
          ]
      },
    ]
}