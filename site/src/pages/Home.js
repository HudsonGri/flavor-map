import ReactDOM from "react-dom";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import Popup from "../components/Popup";
import '../App.css';

import { ChevronDownIcon, ChevronUpIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';


import { all_data } from "../data/all_data";
import { sort_info } from "../data/sort_info";
import { price } from "../data/price";
import { rating } from "../data/rating";
import { rating_count } from "../data/rating_count";

const creators = [{ name: 'HudsonGri', link: 'https://github.com/HudsonGri' }, { name: 'erikhartker', link: 'https://github.com/erikhartker' }, { name: 'mtang08', link: 'https://github.com/mtang08' }]


// Merge, Radix
const sorting_times = { price: [735, 231], rating: [723, 231], rating_count: [734, 375] }

const sleep = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

mapboxgl.accessToken = 'pk.eyJ1IjoiaHVkc29uZ2Z4IiwiYSI6ImNreXYyM3o2NzFzd3EycG0xdDl1NGVmenAifQ.M03sXv9VjsLSqlHB2Hyipw';

const App = () => {

  const hudsonSort = (input_city, type) => {
    console.log('sort')
    let arr = all_data[input_city.city];
    if (type == 'price') {
      arr = [...arr].sort((first, second) => second.price_level - first.price_level);
    }
    if (type == 'rating') {
      arr = [...arr].sort((first, second) => second.rating - first.rating);
    }
    if (type == 'rating_count') {
      arr = [...arr].sort((first, second) => second.user_ratings_total - first.user_ratings_total);
    }
    setCitySorted(arr)
    return arr
  }

  const [data, setData] = useState(rating);


  const [citiesLoaded, setCitiesLoaded] = useState(25);

  const [cityView, setCityView] = useState(false);
  const [citySorted, setCitySorted] = useState(false);

  const viewCity = async (city) => {
    setCitySorted(all_data[city.city])
    hudsonSort(city, sortSelection)
    setCityView(city)
    
  }



  const citiesLoadedClick = () => {
    if (cityView == false) {
      if (citiesLoaded + 25 > data.length) {
        setCitiesLoaded(data.length);
      } else {
        setCitiesLoaded(citiesLoaded + 25);
      }
  } else {
    // If cityview
    if (citiesLoaded + 25 > citySorted.length) {
      setCitiesLoaded(citySorted.length);
    } else {
      setCitiesLoaded(citiesLoaded + 25);
    }
  }
  }
  const getColor = (rating, type) => {
    if (type == 'rating') {
      if (rating >= 4.2) {
        return 'h-12 w-12 rounded-md grid place-items-center m-auto bg-lime-600'
      }
      if (rating >= 4.0) {
        return 'h-12 w-12 rounded-md grid place-items-center m-auto bg-amber-600'
      }
      if (rating > 0) {
        return 'h-12 w-12 rounded-md grid place-items-center m-auto bg-orange-600'
      }
    }

    if (type == 'price') {
      if (rating <= 1.35) {
        return 'h-12 w-12 rounded-md grid place-items-center m-auto bg-lime-600'
      }
      if (rating <= 1.8) {
        return 'h-12 w-12 rounded-md grid place-items-center m-auto bg-amber-600'
      }
      if (rating <= 8) {
        return 'h-12 w-12 rounded-md grid place-items-center m-auto bg-orange-600'
      }
    }

    if (type == 'rating_count') {
      if (rating >= 1500) {
        return 'h-12 w-14 rounded-md grid place-items-center m-auto bg-lime-600'
      }
      if (rating >= 500) {
        return 'h-12 w-14 rounded-md grid place-items-center m-auto bg-amber-600'
      }
      if (rating > 0) {
        return 'h-12 w-14 rounded-md grid place-items-center m-auto bg-orange-600'
      }
    }
  }

  const [sortInfo, setSortInfo] = useState(false);

  const [sortSelection, setSortSelection] = useState('rating');
  const [sorting, setSorting] = useState([723, 231]);




  const handleSelection = async (type) => {


    if (type == 'price') {
      let cities = price;
      setData(price);
      setSortSelection('price');
      setSorting(sorting_times['price']);

    }
    if (type == 'rating') {
      let cities = rating;;
      setData(rating);
      setSortSelection('rating');
      setSorting(sorting_times['rating']);
    }
    if (type == 'rating_count') {
      let cities = rating_count;
      setData(rating_count);
      setSortSelection('rating_count');
      setSorting(sorting_times['rating_count']);
    }
    if (cityView != false) {
      let arr = hudsonSort(cityView, type);
      setCitySorted(arr)
    }
  };

  const getSortInfo = (type) => {


    if (type == 'price') {
      return 1

    }
    if (type == 'rating') {
      return 2
    }
    if (type == 'rating_count') {
      return 0
    }
  };



  const myRef = useRef(null);

  const handleClick = async event => {
    setSortInfo(!sortInfo);

    await sleep(50);

    myRef.current.scrollIntoView();
  };



  const mapContainerRef = useRef(null);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15, focusAfterOpen: false }));

  // Initialize map when component mounts.
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      // Set style
      style: "mapbox://styles/mapbox/light-v10",
      center: [-102.7129, 37.0902],
      zoom: 3.5,
      attributionControl: true
    });

    // Add navigation control.
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.on("load", () => {
      map.resize();

      // add the data source for new a feature collection with no features
      map.addSource("map_info", {
        type: "geojson",
        data: "/map.geojson",
        cluster: false
      });



      // now add the layer, and reference the data source above by name
      map.addLayer({
        id: "map_info-id",
        source: "map_info",
        filter: ['!', ['has', 'point_count']],
        type: "circle",
        paint: {
          'circle-radius': 6,
          'circle-color': [
            'case',
            ['>=', ['get', 'rating_mean'], 4.2],
            'green',
            ['>=', ['get', 'rating_mean'], 4.0],
            'orange',
            'red'
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': 'white',
          'circle-opacity': 1,
          'circle-stroke-opacity': 1,
        }
      });


      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('map_info').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

      // Add geolocate control to the map
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          // When active the map will receive updates to the device's location as it changes.
          trackUserLocation: false,
          // Draw an arrow next to the location dot to indicate which direction the device is heading.
          showUserHeading: false,
          fitBoundsOptions: {
            maxZoom: 10
          }
        })
      );

    });


    // Change cursor to pointer when user hovers over a clickable feature
    map.on("mouseenter", "map_info-id", e => {
      if (e.features.length) {
        map.getCanvas().style.cursor = "pointer";
      }
    });

    map.on('mouseenter', 'clusters', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Reset cursor to default when user is no longer hovering over a clickable feature
    map.on("mouseleave", "map_info-id", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on('mouseleave', 'clusters', () => {
      map.getCanvas().style.cursor = '';
    });

    // Add popup when user clicks a point
    map.on("click", "map_info-id", e => {
      map.flyTo({
        center: e.features[0].geometry.coordinates,
        duration: 750,
        });
      if (e.features.length) {
        const feature = e.features[0];
        // create popup node
        const popupNode = document.createElement("div");
        ReactDOM.render(<Popup feature={feature} />, popupNode);
        // set popup on map
        console.log(feature['properties']['city'])
        const city_name = feature['properties']['city']
        const city_obj = data.find(o => o.city === city_name);
        viewCity(city_obj)
        popUpRef.current
          .setLngLat(feature.geometry.coordinates)
          .setDOMContent(popupNode)
          .addTo(map);
      }
    });


    // clean up on unmount
    return () => map.remove();
  }, []);

  return (

    <div >
      <div className="flex bg-white h-screen w-screen">

        <aside className="sticky top-0 pl-2 py-2 relative z-10 text-center">
          {!cityView &&
            <div className='bg-zinc-100/90 w-80 shadow-md rounded-lg border-4 border-amber-500/90 xl:h-5/6 h-full overflow-y-auto scrollbar-hide'>
              <p className='text-amber-600 text-3xl font-bold pt-3'>Rankings</p>
              <div className='grid grid-flow-col place-items-center text-center text-lg text-amber-700 pt-2'>

                <button className={sortSelection == 'rating' ? 'underline p-1 w-full' : 'p-1 w-full'} onClick={() => { handleSelection('rating') }}><p>Rating</p></button>
                <button className={sortSelection == 'price' ? 'underline p-1 w-full' : 'p-1 w-full'} onClick={() => { handleSelection('price') }}><p>Price</p></button>
                <button className={sortSelection == 'rating_count' ? 'underline p-1 w-full' : 'p-1 w-full'} onClick={() => { handleSelection('rating_count') }}><p>Rating Count</p></button>


              </div>
              {sortSelection == 'rating' &&
                <p className="text-zinc-600">Mean restaurant rating from 1-5</p>
              }
              {sortSelection == 'price' &&
                <p className="text-zinc-600">Mean restaurant price level from 1-4</p>
              }
              {sortSelection == 'rating_count' &&
                <p className="text-zinc-600">Mean restaurant review count</p>
              }
              <div role="list" className="px-5 pt-3">
                {data.slice(0, citiesLoaded).map((city) => (

                  <button key={city.index} onClick={() => { viewCity(city) }} className="py-1.5 flex rounded-lg hover:bg-zinc-300 w-full">
                    {sortSelection == 'rating' &&
                      <div className={getColor(city.rating_mean, 'rating')}><p className='text-xl font-bold text-zinc-100'>{city.rating_mean.toFixed(2)}</p></div>
                    }
                    {sortSelection == 'price' &&
                      <div className={getColor(city.price_mean, 'price')}><p className='text-xl font-bold text-zinc-100'>{city.price_mean.toFixed(2)}</p></div>
                    }
                    {sortSelection == 'rating_count' &&
                      <div className={getColor(city.user_ratings_total_mean, 'rating_count')}><p className='text-xl font-bold text-zinc-100'>{city.user_ratings_total_mean.toFixed(0).toLocaleString("en-US")}</p></div>
                    }
                    <div className="place-items-center text-center w-3/4 m-auto">
                      <p className="text-xl font-bold text-zinc-800">{city.city}</p>
                      <p className="text-lg text-zinc-800">{city.state}</p>
                    </div>
                  </button>


                ))}
                {citiesLoaded != data.length &&
                  <button className='text-lg underline text-zinc-800' onClick={() => { citiesLoadedClick() }}>Load More +</button>
                }
                <p className='text-base text-zinc-500 pt-2'>{citiesLoaded}/{data.length} Cities Loaded</p>
                <div className='pt-3'><div className='border-t border-zinc-400'></div></div>
                <p className='text-sm text-zinc-500 py-2'>Created By:
                  {creators.map((person) => (
                    <span> <a className='underline' href={person.link}>{person.name}</a>, </span>
                  ))}
                </p>
                <button onClick={() => { handleClick() }}><p className='text-sm text-zinc-500 py-2'>
                  Sort Information {sortInfo ? <ChevronUpIcon className='h-5 inline' /> : <ChevronDownIcon className='h-5 inline' />}
                </p></button>
                {sortInfo &&
                  <div ref={myRef} className='text-base text-zinc-500 pb-3'>
                    <p><span className='underline'>Merge Sort</span>: {sorting[0]} μseconds</p>
                    <p><span className='underline'>Radix Sort</span>: {sorting[1]} μseconds</p>
                  </div>
                }

              </div>

            </div>
          }
          {cityView &&
            <div className='bg-zinc-100/90 w-80 shadow-md rounded-lg border-4 border-amber-500/90 xl:h-5/6 h-full overflow-y-auto scrollbar-hide'>
              <button onClick={() => { setCityView(false) }} className='h-7 w-7 rounded-md grid place-items-center m-auto z-0 top-3 right-1 absolute bg-zinc-200'><ArrowUturnLeftIcon className='h-6 w-6 text-zinc-600' /></button>
              <p className='text-zinc-800 text-3xl font-bold pt-3 grid grid-flow-row'>

                <p className="text-2xl p-1 pt-2">{cityView.city}, {cityView.state}</p>


              </p>

              <div className='grid grid-flow-col place-items-center text-center text-lg text-amber-700 pt-2'>
                <button className={sortSelection == 'rating' ? 'underline p-1 w-full' : 'p-1 w-full'} onClick={() => { handleSelection('rating') }}><p>Rating</p></button>
                <button className={sortSelection == 'price' ? 'underline p-1 w-full' : 'p-1 w-full'} onClick={() => { handleSelection('price') }}><p>Price</p></button>
                <button className={sortSelection == 'rating_count' ? 'underline p-1 w-full' : 'p-1 w-full'} onClick={() => { handleSelection('rating_count') }}><p>Rating Count</p></button>
              </div>
              {sortSelection == 'rating' &&
                <p className="text-zinc-600">Mean restaurant rating from 1-5</p>
              }
              {sortSelection == 'price' &&
                <p className="text-zinc-600">Mean restaurant price level from 1-4</p>
              }
              {sortSelection == 'rating_count' &&
                <p className="text-zinc-600">Mean restaurant review count</p>
              }
              <div role="list" className="px-5 pt-3">
                {citySorted.slice(0, citiesLoaded).map((restaurant) => (

                  <li key={restaurant.index} className={restaurant.price_level > 0 ? 'py-1.5 flex rounded-lg hover:bg-zinc-300' : 'hidden'}>

                    {sortSelection == 'rating' &&
                      <div className={getColor(restaurant.rating, 'rating')}><p className='text-xl font-bold text-zinc-100'>{restaurant.rating.toFixed(2)}</p></div>
                    }
                    {sortSelection == 'price' &&
                      <div className={getColor(restaurant.price_level, 'price')}><p className='text-xl font-bold text-zinc-100'>{restaurant.price_level.toFixed(0)}</p></div>
                    }
                    {sortSelection == 'rating_count' &&
                      <div className={getColor(restaurant.user_ratings_total, 'rating_count')}><p className='text-base font-bold text-zinc-100'>{restaurant.user_ratings_total.toFixed(0).toLocaleString("en-US")}</p></div>
                    }
                    <div className="place-items-center text-center w-3/4 m-auto">
                      <p className="text-lg font-bold text-zinc-800">{restaurant.name}</p>
                      <p className="text-lg text-zinc-800">{restaurant.vicinity}</p>
                    </div>
                  </li>
                ))}
                {citiesLoaded != citySorted.length &&
                  <button className='text-lg  underline text-zinc-800' onClick={() => { citiesLoadedClick() }}>Load More +</button>
                }
                <p className='text-base text-zinc-400 pt-2'>{citiesLoaded}/{citySorted.length} Restaurants Loaded</p>
                <div className='pt-3'><div className='border-t border-zinc-400'></div></div>
                <p className='text-sm text-zinc-400 py-2'>Created By:
                  {creators.map((person) => (
                    <span> <a className='underline' href={person.link}>{person.name}</a>, </span>
                  ))}
                </p>
                <button onClick={() => { handleClick() }}><p className='text-sm text-zinc-400 py-2'>
                  Sort Information {sortInfo ? <ChevronUpIcon className='h-5 inline' /> : <ChevronDownIcon className='h-5 inline' />}
                </p></button>
                {sortInfo &&
                  <div ref={myRef} className='text-base text-zinc-400 pb-3'>
                    <p><span className='underline'>Merge Sort</span>: {sort_info[cityView.city]['merge'][getSortInfo(sortSelection)]} μseconds</p>
                    <p><span className='underline'>Radix Sort</span>: {sort_info[cityView.city]['radix'][getSortInfo(sortSelection)]} μseconds</p>
                  </div>
                }

              </div>

            </div>
          }
        </aside>
        <div className="sticky z-50 py-2 h-32 relative w-2/3 text-center grid grid-flow-row place-items-center">
          <div className='bg-zinc-100/90 w-90 shadow-md rounded-lg border-4 border-amber-500/90'>
            <p className='text-4xl font-extrabold tracking-tight text-amber-600 pt-3'>Flavor Map</p>
            <p className='text-lg p-2 text-amber-700'>View cities across America ranked by their average restaurant ratings.</p>
          </div>
        </div>


        <div className="map-container-full z-0" ref={mapContainerRef}> </div>

      </div>



    </div>

  );
};

export default App;
