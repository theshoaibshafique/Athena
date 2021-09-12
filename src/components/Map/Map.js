import React, { useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
import "./Map.css";

const libraries = ["places"];

const mapContainerStyle = {
  maxWidth: "1200px",
  height: "500px",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const center = {
  lat: 31.450365,
  lng: 73.134964,
};

const Map = ({ setlatitude, setlongitude, longitude, latitude, apiKey }) => {
  //const API_KEY = "AIzaSyDnCrsPAD8Jk6iK8JNhrtvvBzF4B5Br-1g";
  const API_KEY = apiKey[0].key;
  const [marker, setmarker] = useState();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  if (loadError) return "Error loading maps";

  try {
    return (
      <div>
        <Search
          setlatitude={setlatitude}
          setlongitude={setlongitude}
          panTo={panTo}
        />
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={center}
          onLoad={onMapLoad}
          options={options}
          onClick={(e) => {
            setlongitude(e.latLng.lat());
            setlatitude(e.latLng.lng());
            setmarker(e.latLng);
          }}
        >
          <Marker position={marker} />
        </GoogleMap>
      </div>
    );
  } catch (error) {
    console.log(error);
  }
};

function Search({ panTo, setlatitude, setlongitude }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 100 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setlatitude(lat);
      setlongitude(lng);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        top: "2rem",
        left: "50%",
        zIndex: "10",
        width: "100%",
        maxWidth: "400px",
        transform: "translate(-25%)",
      }}
    >
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

export default Map;
