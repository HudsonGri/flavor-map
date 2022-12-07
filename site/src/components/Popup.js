import React from "react";

const Popup = ({ feature }) => {
  const { key, city, state, price_mean, rating_mean, user_ratings_total_mean, restaurants_tracked, lat, lng } = feature.properties;

  return (
    <div className="leading-normal" id={`popup-${key}`}>
      <p className="text-xl font-bold">{city}, {state}</p>
      <div className="tems-center">

      
      <p className="text-base pt-1">Mean Rating: {rating_mean.toFixed(2)}</p>
      <p className="text-base pt-1">Mean Price: {price_mean.toFixed(2)}</p>
      <p className="text-base pt-1">Mean Rating Count: {user_ratings_total_mean.toFixed(0)}</p>
      <p className="text-base text-zinc-500 pt-1">{restaurants_tracked} Restaurants Tracked</p>
    </div>
    </div>
  );
};

export default Popup;
