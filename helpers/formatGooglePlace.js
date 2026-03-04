function formatGooglePlace(place) {
  return {
    name: place.name,
    rating: place.rating,
    address: place.vicinity,
    placeId: place.place_id,
    photoReference: place.photos?.[0]?.photo_reference || null,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
  };
}

export default formatGooglePlace;
