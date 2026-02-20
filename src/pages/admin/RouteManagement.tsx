import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/shared/DataTable';
import { Plus, X, Pencil, Trash2, MapPin, Navigation } from 'lucide-react';
import { useAdmin, AdminRoute } from '../../context/AdminContext';
import { Input } from '../../components/ui/Input';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Function to calculate center of multiple points
function getCenter(coords: { lat: number, lng: number }[]) {
  if (coords.length === 0) return [6.9271, 79.8612] as [number, number];
  const lat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
  const lng = coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;
  return [lat, lng] as [number, number];
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, 12);
  }, [center, map]);
  return null;
}

export function AdminRouteManagement() {
  const { routes, trucks, addRoute, updateRoute, deleteRoute } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<AdminRoute | null>(null);
  const [isGeocoding, setIsGeocoding] = useState({ start: false, end: false });

  // Get unique drivers from trucks
  const availableDrivers = Array.from(new Set(trucks.map(t => t.driver).filter(Boolean)));

  const [newRoute, setNewRoute] = useState<Omit<AdminRoute, 'id'>>({
    name: '',
    driver: '',
    status: 'Active',
    progress: '0%',
    startLocation: '',
    endLocation: '',
    startCoords: undefined,
    endCoords: undefined
  });

  const handleOpenCreate = () => {
    setEditingRoute(null);
    setNewRoute({
      name: '',
      driver: '',
      status: 'Active',
      progress: '0%',
      startLocation: '',
      endLocation: '',
      startCoords: undefined,
      endCoords: undefined
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (route: AdminRoute) => {
    setEditingRoute(route);
    setNewRoute({
      name: route.name,
      driver: route.driver,
      status: route.status,
      progress: route.progress,
      startLocation: route.startLocation || '',
      endLocation: route.endLocation || '',
      startCoords: route.startCoords,
      endCoords: route.endCoords
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      deleteRoute(id);
    }
  };

  const handleGeocode = async (type: 'start' | 'end', value: string) => {
    if (!value) return;

    setIsGeocoding(prev => ({ ...prev, [type]: true }));
    try {
      // Append Sri Lanka to search query for better accuracy
      const query = `${value}, Sri Lanka`;
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        setNewRoute(prev => ({
          ...prev,
          [type === 'start' ? 'startCoords' : 'endCoords']: coords
        }));
      }
    } catch (error) {
      console.error(`Geocoding ${type} failed`, error);
    } finally {
      setIsGeocoding(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = () => {
    if (!newRoute.name || !newRoute.driver) return;

    if (editingRoute) {
      updateRoute(editingRoute.id, newRoute);
    } else {
      addRoute(newRoute);
    }

    setIsModalOpen(false);
    setEditingRoute(null);
  };

  const columns = [{
    header: 'Route Name',
    accessorKey: 'name' as const,
    cell: (item: AdminRoute) => (
      <div>
        <div className="font-medium">{item.name}</div>
        <div className="text-xs text-neutral-500">{item.id}</div>
      </div>
    )
  }, {
    header: 'Driver',
    accessorKey: 'driver' as const
  }, {
    header: 'From',
    accessorKey: 'startLocation' as const,
    cell: (item: AdminRoute) => <span className="text-sm">{item.startLocation || '-'}</span>
  }, {
    header: 'To',
    accessorKey: 'endLocation' as const,
    cell: (item: AdminRoute) => <span className="text-sm">{item.endLocation || '-'}</span>
  }, {
    header: 'Status',
    accessorKey: 'status' as const
  }, {
    header: 'Actions',
    accessorKey: 'id' as const,
    cell: (item: any) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)}>
          <Pencil className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    )
  }];

  return (
    <div className="h-auto lg:h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-shrink-0 gap-4 sm:gap-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Route Management
          </h2>
          <p className="text-neutral-500">
            Optimize and assign collection routes with visual mapping.
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Route
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">
                {editingRoute ? 'Edit Route' : 'Add New Route'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Route Name</label>
                <Input
                  value={newRoute.name}
                  onChange={e => setNewRoute({ ...newRoute, name: e.target.value })}
                  placeholder="e.g. Zone A Collection"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Assign Driver</label>
                <select
                  className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newRoute.driver}
                  onChange={e => setNewRoute({ ...newRoute, driver: e.target.value })}
                >
                  <option value="">Select a Driver</option>
                  {availableDrivers.map(driver => (
                    <option key={driver} value={driver}>{driver}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <label className="text-sm font-medium">From Location</label>
                  <Input
                    value={newRoute.startLocation}
                    onChange={e => setNewRoute({ ...newRoute, startLocation: e.target.value })}
                    onBlur={() => handleGeocode('start', newRoute.startLocation)}
                    placeholder="e.g. Colombo Fort"
                  />
                  {isGeocoding.start && <span className="absolute right-2 top-8 text-xs text-forest-500">Locating...</span>}
                </div>
                <div className="relative">
                  <label className="text-sm font-medium">To Location</label>
                  <Input
                    value={newRoute.endLocation}
                    onChange={e => setNewRoute({ ...newRoute, endLocation: e.target.value })}
                    onBlur={() => handleGeocode('end', newRoute.endLocation)}
                    placeholder="e.g. Mount Lavinia"
                  />
                  {isGeocoding.end && <span className="absolute right-2 top-8 text-xs text-forest-500">Locating...</span>}
                </div>
              </div>

              {/* Coords Preview (Read-only) */}
              <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500 bg-neutral-50 p-2 rounded">
                <div>Start: {newRoute.startCoords ? `${newRoute.startCoords.lat.toFixed(4)}, ${newRoute.startCoords.lng.toFixed(4)}` : 'Not set'}</div>
                <div>End: {newRoute.endCoords ? `${newRoute.endCoords.lat.toFixed(4)}, ${newRoute.endCoords.lng.toFixed(4)}` : 'Not set'}</div>
              </div>

              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={isGeocoding.start || isGeocoding.end || !newRoute.startCoords || !newRoute.endCoords}
              >
                {editingRoute ? 'Save Changes' : 'Create Route'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:flex-1 lg:min-h-0">
        <div className="lg:col-span-2 h-[400px] lg:h-full flex flex-col relative">
          <Card className="flex-1 p-0 overflow-hidden border-0 shadow-md relative z-0">
            <MapContainer
              center={[6.9271, 79.8612]}
              zoom={11}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              <MapUpdater center={[6.9271, 79.8612]} />

              {/* Render All Routes */}
              {routes.map(route => {
                if (route.startCoords && route.endCoords) {
                  return (
                    <React.Fragment key={route.id}>
                      {/* Start Marker */}
                      <Marker position={[route.startCoords.lat, route.startCoords.lng]}>
                        <Popup>
                          <strong>Start: {route.startLocation}</strong><br />
                          {route.name}
                        </Popup>
                      </Marker>

                      {/* End Marker */}
                      <Marker position={[route.endCoords.lat, route.endCoords.lng]}>
                        <Popup>
                          <strong>End: {route.endLocation}</strong><br />
                          {route.name}
                        </Popup>
                      </Marker>

                      {/* Polyline */}
                      <Polyline
                        positions={[
                          [route.startCoords.lat, route.startCoords.lng],
                          [route.endCoords.lat, route.endCoords.lng]
                        ]}
                        pathOptions={{ color: route.status === 'Active' ? '#10b981' : '#6b7280', weight: 4, opacity: 0.7 }}
                      />
                    </React.Fragment>
                  );
                }
                return null;
              })}
            </MapContainer>

            {/* Legend Overlay */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-2 rounded shadow text-xs z-[1000]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-1 bg-emerald-500 rounded"></div>
                <span>Active Route</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-gray-500 rounded"></div>
                <span>Inactive/Pending</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4 lg:overflow-y-auto">
          <Card className="flex-1">
            <div className="p-4 border-b border-neutral-100">
              <h3 className="font-semibold text-sm">Active Routes</h3>
            </div>
            <div className="p-2">
              <DataTable data={routes} columns={columns} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}