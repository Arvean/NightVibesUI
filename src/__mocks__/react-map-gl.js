import React from 'react';

const Map = ({ children }) => <div data-testid="map-container">{children}</div>;
const Marker = ({ children, latitude, longitude }) => (
  <div data-testid={`marker-${latitude}-${longitude}`}>{children}</div>
);
const Popup = () => <div />;
const NavigationControl = () => <div />;
const GeolocateControl = () => <div />;

export { Marker, Popup, NavigationControl, GeolocateControl };
export default Map;
