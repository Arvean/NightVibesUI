import React from 'react';

export const Map = ({ children, ...props }) => (
  <div data-testid="map-container" {...props}>
    {children}
  </div>
);

export const Marker = ({ children, ...props }) => (
  <div {...props}>
    {children}
  </div>
);

export const Popup = ({ children, ...props }) => (
  <div {...props}>
    {children}
  </div>
);

export default {
  Map,
  Marker,
  Popup
};
