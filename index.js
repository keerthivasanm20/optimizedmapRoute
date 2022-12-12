import React from "react";
/* eslint-disable  */
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWFhbm9ydGhlYXN0IiwiYSI6ImNsOHU2Ym56eTAwanozcHBkbTJ5bm5qa2UifQ.8Mgc2UYdXE8_T0JQmqTsiw';
export default function index() {
    //intializing the longititude and lattitudes 
    const coordinates=[-96.5108,39.1184]

    //intialize the map
     const map = new mapboxgl.Map({
               container: mapContainer.current,
               style: 'mapbox://styles/mapbox/light-v10',
               center: coordinates, // starting position
               zoom: zoom,
               minzoom: 5,
               maxzoom: 6,
             });
  return (
   <div id='map'></div>
  );
}
