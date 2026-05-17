import { useEffect, useState, type ReactNode } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Vite - use local Leaflet image assets for stability
const DefaultIcon = L.icon({
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map events and interactions
interface MapControllerProps {
  onMapReady?: (map: L.Map) => void;
  center?: [number, number];
  zoom?: number;
  onMapClick?: (latlng: L.LatLng) => void;
  onZoomChange?: (zoom: number) => void;
  onMoveEnd?: (center: [number, number]) => void;
  enableGeolocation?: boolean;
  onLocationFound?: (position: [number, number]) => void;
  onLocationError?: (error: GeolocationPositionError) => void;
  trackInteractions?: boolean;
  onInteraction?: (type: string, data?: any) => void;
}

function MapController({
  onMapReady,
  center = [-38.7359, -72.5904],
  zoom = 12,
  onMapClick,
  onZoomChange,
  onMoveEnd,
  enableGeolocation = false,
  onLocationFound,
  onLocationError,
  trackInteractions = false,
  onInteraction
}: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  // Handle map click events
  useEffect(() => {
    if (onMapClick) {
      const handleClick = (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng);
        if (trackInteractions && onInteraction) {
          onInteraction('map_click', { latlng: e.latlng });
        }
      };
      map.on('click', handleClick);
      return () => {
        map.off('click', handleClick);
      };
    }
  }, [map, onMapClick, trackInteractions, onInteraction]);

  // Handle zoom change events
  useEffect(() => {
    if (onZoomChange) {
      const handleZoom = () => {
        onZoomChange(map.getZoom());
        if (trackInteractions && onInteraction) {
          onInteraction('zoom_change', { zoom: map.getZoom() });
        }
      };
      map.on('zoomend', handleZoom);
      return () => {
        map.off('zoomend', handleZoom);
      };
    }
  }, [map, onZoomChange, trackInteractions, onInteraction]);

  // Handle move end events
  useEffect(() => {
    if (onMoveEnd) {
      const handleMove = () => {
        const center = map.getCenter();
        onMoveEnd([center.lat, center.lng]);
        if (trackInteractions && onInteraction) {
          onInteraction('move_end', { center: [center.lat, center.lng] });
        }
      };
      map.on('moveend', handleMove);
      return () => {
        map.off('moveend', handleMove);
      };
    }
  }, [map, onMoveEnd, trackInteractions, onInteraction]);

  // Handle geolocation
  useEffect(() => {
    if (enableGeolocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (onLocationFound) {
            onLocationFound([latitude, longitude]);
          }
          if (trackInteractions && onInteraction) {
            onInteraction('geolocation_success', { position: [latitude, longitude] });
          }
        },
        (error) => {
          if (onLocationError) {
            onLocationError(error);
          }
          if (trackInteractions && onInteraction) {
            onInteraction('geolocation_error', { error: error.message });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    }
  }, [enableGeolocation, onLocationFound, onLocationError, trackInteractions, onInteraction]);

  return null;
}

interface MapViewProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string | number;
    position: [number, number];
    popup?: string | ReactNode;
    icon?: L.Icon;
  }>;
  onMapReady?: (map: L.Map) => void;
  onMarkerClick?: (markerId: string | number) => void;
  onMapClick?: (latlng: L.LatLng) => void;
  onZoomChange?: (zoom: number) => void;
  onMoveEnd?: (center: [number, number]) => void;
  enableTouchZoom?: boolean;
  enableScrollWheelZoom?: boolean;
  enableDragging?: boolean;
  enableGeolocation?: boolean;
  onLocationFound?: (position: [number, number]) => void;
  onLocationError?: (error: GeolocationPositionError) => void;
  trackInteractions?: boolean;
  onInteraction?: (type: string, data?: any) => void;
}

export function MapView({
  className = '',
  center = [-38.7359, -72.5904], // Temuco coordinates
  zoom = 12,
  markers = [],
  onMapReady,
  onMarkerClick,
  onMapClick,
  onZoomChange,
  onMoveEnd,
  enableTouchZoom = true,
  enableScrollWheelZoom = true,
  enableDragging = true,
  enableGeolocation = false,
  onLocationFound,
  onLocationError,
  trackInteractions = false,
  onInteraction
}: MapViewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} style={{ height: '100%', minHeight: '100%' }}>
        <div className="text-gray-500">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`} style={{ height: '100%', minHeight: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={true}
        scrollWheelZoom={enableScrollWheelZoom}
        dragging={enableDragging}
        touchZoom={enableTouchZoom}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
        keyboardPanDelta={80}
        style={{ height: '100%', width: '100%', touchAction: 'pan-y pinch-zoom' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          center={center}
          zoom={zoom}
          onMapReady={onMapReady}
          onMapClick={onMapClick}
          onZoomChange={onZoomChange}
          onMoveEnd={onMoveEnd}
          enableGeolocation={enableGeolocation}
          onLocationFound={onLocationFound}
          onLocationError={onLocationError}
          trackInteractions={trackInteractions}
          onInteraction={onInteraction}
        />

        {/* Default marker for Temuco */}
        <Marker position={center}>
          <Popup>
            <div className="text-center">
              <strong>Temuco</strong><br />
              Centro de la región
            </div>
          </Popup>
        </Marker>

        {/* Custom markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={marker.icon || DefaultIcon}
            eventHandlers={{
              click: (event: L.LeafletMouseEvent) => {
                event.originalEvent?.stopPropagation();
                onMarkerClick?.(marker.id);
              }
            }}
          >
            {marker.popup && (
              <Popup>
                {marker.popup}
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;