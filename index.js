import './TripFinder.scss';
import React from 'react';
/* eslint-disable  */
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useCallback } from 'react';
import { useEffect } from 'react';
import * as turf from '@turf/turf';
mapboxgl.accessToken =
  'your_access_token';
function TripForm() {
  //intializing the longititude and lattitudes
  const coordinates = [-112.073555, 33.44793];
  const mapContainer = useRef(null);
  const map = useRef(null);
  const FromLocation = [-110.965274, 32.228759];
  const ToLocation = [-112.073555, 33.44793];
  let to;
  let from;
  useEffect(() => {
    //intialize the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current, // container id
      style: 'mapbox://styles/mapbox/light-v11', // stylesheet location
      center: coordinates, // starting position
      zoom: 12, // starting zoom
    });
    // Create a GeoJSON feature collection for the warehouse
    from = turf.featureCollection([turf.point(FromLocation)]);
    to = turf.featureCollection([turf.point(ToLocation)]);
    addMarkerV2();
    plotroute();
    plotroute();
  }, []);

  const plotroute = async () => {
    const query = await fetchLoaction();
    const response = await query.json();

    const nothing = turf.featureCollection([]);

    const routeGeoJSON = turf.featureCollection([
      turf.feature(response.trips[0].geometry),
    ]);
    // Update the `route` source by getting the route source
    // and setting the data equal to routeGeoJSON

    // if the route already exists on the map, we'll reset it using setData
    if (map.current.getSource('route')) {
      map.current.getSource('route').setData(routeGeoJSON);
    } else {
      map.current.addSource('route', {
        type: 'geojson',
        data: nothing,
      });
      map.current.addLayer(
        {
          id: 'routeline-active',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#0E3464',
            'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 22, 12],
          },
        },
        'waterway-label'
      );
    }
  };

  const addMarkerV2 = useCallback(() => {
    // map.current.on('load', () => {
    map.current.on('load', async () => {
      // Create a new marker
      // new mapboxgl.Marker(marker).setLngLat(truckLocation).addTo(map);
      // Create a circle layer
      map.current.addLayer({
        id: 'from',
        type: 'circle',
        source: {
          data: to,
          type: 'geojson',
        },
        paint: {
          'circle-radius': 10,
          'circle-color': 'blue',
          'circle-stroke-color': 'blue',
          'circle-stroke-width': 3,
        },
      });
      map.current.addLayer({
        id: 'to',
        type: 'circle',
        source: {
          data: from,
          type: 'geojson',
        },
        paint: {
          'circle-radius': 10,
          'circle-color': 'red',
          'circle-stroke-color': 'red',
          'circle-stroke-width': 3,
        },
      });
    });
  });

  const fetchLoaction = async () => {
    console.log(FromLocation.join(','));
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${FromLocation.join(
        ','
      )};${ToLocation.join(',')}?steps=true&geometries=geojson&access_token=${
        mapboxgl.accessToken
      }`,
      { method: 'GET' }
    );
    console.log(response)

    let data = await response.json();


    data = data.routes[0];

    let coordinates = data.geometry.coordinates;
    console.log(coordinates);
    const len = coordinates.length;
    const distributions = [1, 2];
    if (len > 12) {
      coordinates.splice(1, coordinates.length - 12);
    }

    return await fetch(
      `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates.join(
        ';'
      )}?distributions=${distributions}&overview=full&steps=true&geometries=geojson&roundtrip=false&source=first&destination=last&access_token=${
        mapboxgl.accessToken
      }`,
      { method: 'GET' }
    );
  };

  return (
    <>
      <div id="map" ref={mapContainer}></div>
    </>
  );
}
export default TripForm;
