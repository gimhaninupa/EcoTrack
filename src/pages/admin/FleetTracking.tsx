import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Truck, MapPin, Battery, Fuel, X, Pencil, Trash2, History, Phone } from 'lucide-react';
import { useAdmin, Truck as TruckType } from '../../context/AdminContext';
import { Input } from '../../components/ui/Input';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to fly to selected truck
function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 13);
    }, [center, map]);
    return null;
}

export function AdminFleetTracking() {
    const { trucks, addTruck, updateTruck, deleteTruck } = useAdmin();
    const [selectedTruck, setSelectedTruck] = useState<TruckType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [editingTruck, setEditingTruck] = useState<TruckType | null>(null);
    const [isGeocoding, setIsGeocoding] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Omit<TruckType, 'id'>>({
        driver: '',
        status: 'Idle',
        location: '',
        battery: 100,
        fuel: 100,
        route: '-',
        type: '',
        vehicleNumber: '',
        contactNumber: '',
        latitude: undefined,
        longitude: undefined
    });

    // Update selected truck when list changes
    useEffect(() => {
        if (!selectedTruck && trucks.length > 0) {
            setSelectedTruck(trucks[0]);
        } else if (trucks.length === 0) {
            setSelectedTruck(null);
        } else if (selectedTruck && !trucks.find(t => t.id === selectedTruck.id)) {
            setSelectedTruck(trucks[0]);
        }
    }, [trucks, selectedTruck]);

    const handleGeocode = async () => {
        if (!formData.location) return;

        // If user already manually entered coords, don't overwrite immediately unless they want to (simple logic for now: just fetch if location changes)
        // Actually, let's fetch if location is present.

        setIsGeocoding(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon)
                }));
            }
        } catch (error) {
            console.error("Geocoding failed", error);
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleExportReport = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const htmlContent = `
            <html>
                <head>
                    <title>Fleet Status Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #1a1a1a; margin-bottom: 20px; }
                        .meta { color: #666; margin-bottom: 30px; font-size: 0.9em; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                        th { background-color: #f5f5f5; font-weight: bold; }
                        tr:nth-child(even) { background-color: #fafafa; }
                        .status { font-weight: bold; text-transform: capitalize; }
                    </style>
                </head>
                <body>
                    <h1>EcoTrack Fleet Status Report</h1>
                    <div class="meta">
                        <p>Generated on: ${new Date().toLocaleString()}</p>
                        <p>Total Vehicles: ${trucks.length}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Vehicle No</th>
                                <th>Driver</th>
                                <th>Contact</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Coords</th>
                                <th>Route</th>
                                <th>Fuel</th>
                                <th>Battery</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${trucks.map(truck => `
                                <tr>
                                    <td>${truck.vehicleNumber || truck.id}</td>
                                    <td>${truck.driver}</td>
                                    <td>${truck.contactNumber || '-'}</td>
                                    <td>${truck.type}</td>
                                    <td><span class="status">${truck.status}</span></td>
                                    <td>${truck.location}</td>
                                    <td>${truck.latitude?.toFixed(4)}, ${truck.longitude?.toFixed(4)}</td>
                                    <td>${truck.route}</td>
                                    <td>${truck.fuel}%</td>
                                    <td>${truck.battery}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <script>
                        window.onload = () => {
                            window.print();
                        };
                    </script>
                </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    const handleOpenAdd = () => {
        setEditingTruck(null);
        setFormData({
            driver: '',
            status: 'Idle',
            location: '',
            battery: 100,
            fuel: 100,
            route: '-',
            type: '',
            vehicleNumber: '',
            contactNumber: '',
            latitude: undefined,
            longitude: undefined
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (truck: TruckType, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingTruck(truck);
        setFormData({
            driver: truck.driver,
            status: truck.status,
            location: truck.location,
            battery: truck.battery,
            fuel: truck.fuel,
            route: truck.route,
            type: truck.type,
            vehicleNumber: truck.vehicleNumber || '',
            contactNumber: truck.contactNumber || '',
            latitude: truck.latitude || undefined,
            longitude: truck.longitude || undefined
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to remove this vehicle?')) {
            deleteTruck(id);
        }
    };

    const handleSubmit = () => {
        if (!formData.driver || !formData.vehicleNumber) return;

        // Ensure defaults if empty
        const submissionData = {
            ...formData,
            status: formData.status,
            location: formData.location || 'Unknown',
            type: formData.type || 'Generic',
            latitude: formData.latitude || 6.9271, // Valid default coordinate
            longitude: formData.longitude || 79.8612
        };

        if (editingTruck) {
            updateTruck(editingTruck.id, submissionData);
        } else {
            addTruck(submissionData);
        }
        setIsModalOpen(false);
    };

    const handleContactDriver = () => {
        if (selectedTruck && selectedTruck.contactNumber) {
            alert(`Calling ${selectedTruck.driver} at ${selectedTruck.contactNumber}...`);
        } else if (selectedTruck) {
            alert(`No contact number for ${selectedTruck.driver}.`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Fleet Tracking</h2>
                    <p className="text-neutral-500">Monitor real-time location and status of collection vehicles.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportReport}>Export Report</Button>
                    <Button onClick={handleOpenAdd}>Add Vehicle</Button>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold">{editingTruck ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-3">
                            <Input
                                placeholder="Vehicle Name / Driver Name"
                                value={formData.driver}
                                onChange={e => setFormData({ ...formData, driver: e.target.value })}
                            />
                            <div className="relative">
                                <Input
                                    placeholder={isGeocoding ? "Locating..." : "Location (e.g. Colombo)"}
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    onBlur={handleGeocode}
                                />
                                {isGeocoding && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="animate-spin h-3 w-3 border-2 border-forest-500 border-t-transparent rounded-full"></div>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    placeholder="Latitude"
                                    type="number"
                                    value={formData.latitude ?? ''}
                                    onChange={e => setFormData({ ...formData, latitude: e.target.value ? Number(e.target.value) : undefined })}
                                />
                                <Input
                                    placeholder="Longitude"
                                    type="number"
                                    value={formData.longitude ?? ''}
                                    onChange={e => setFormData({ ...formData, longitude: e.target.value ? Number(e.target.value) : undefined })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    placeholder="Vehicle Type"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                />
                                <Input
                                    placeholder="Vehicle Number"
                                    value={formData.vehicleNumber}
                                    onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value })}
                                />
                            </div>
                            <Input
                                placeholder="Contact Number"
                                value={formData.contactNumber}
                                onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                            />
                            <Button className="w-full" onClick={handleSubmit}>
                                {editingTruck ? 'Save Changes' : 'Add Vehicle'}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* History Modal */}
            {isHistoryOpen && selectedTruck && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">History: {selectedTruck.id}</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-2 text-sm text-neutral-600">
                            <p>• 08:00 AM - Departed from Depot</p>
                            <p>• 09:15 AM - Collection at North District</p>
                            <p>• 10:30 AM - Arrived at Transfer Station</p>
                            <p>• 11:45 AM - Returning to Route</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button size="sm" onClick={() => setIsHistoryOpen(false)}>Close</Button>
                        </div>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
                {/* Truck List */}
                <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2">
                    {trucks.length === 0 ? (
                        <div className="text-center p-8 text-neutral-500 bg-neutral-50 rounded-lg border border-dashed">
                            <Truck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No vehicles in fleet.</p>
                            <Button size="sm" variant="ghost" onClick={handleOpenAdd}>Add one now</Button>
                        </div>
                    ) : (
                        trucks.map(truck => (
                            <Card
                                key={truck.id}
                                className={`cursor-pointer transition-all hover:border-forest-400 group ${selectedTruck?.id === truck.id ? 'border-forest-500 ring-1 ring-forest-500' : ''}`}
                                onClick={() => setSelectedTruck(truck)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-5 w-5 text-neutral-500" />
                                            <span className="font-bold text-sm">{truck.id}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <Badge variant={
                                                truck.status === 'En Route' ? 'default' :
                                                    truck.status === 'Collection' ? 'success' :
                                                        truck.status === 'Maintenance' ? 'destructive' : 'secondary'
                                            }>
                                                {truck.status}
                                            </Badge>
                                            <div className="hidden group-hover:flex gap-1 ml-2">
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => handleOpenEdit(truck, e)}>
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={(e) => handleDelete(truck.id, e)}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Driver</span>
                                            <span className="font-medium">{truck.driver}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Location</span>
                                            <span className="font-medium">{truck.location}</span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-100">
                                            <div className="flex items-center gap-1 text-xs text-neutral-600">
                                                <Battery className="h-3 w-3" /> {truck.battery}%
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-neutral-600">
                                                <Fuel className="h-3 w-3" /> {truck.fuel}%
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Map View */}
                <Card className="lg:col-span-2 overflow-hidden flex flex-col relative z-0">
                    <CardHeader className="py-3 px-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-row justify-between items-center z-10 relative">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-forest-500" />
                            Live Map View
                        </CardTitle>
                        <div className="text-xs text-neutral-500">
                            Updates live
                        </div>
                    </CardHeader>

                    <div className="flex-1 bg-neutral-100 relative min-h-[400px] z-0">
                        <MapContainer
                            center={[6.9271, 79.8612]}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />

                            {/* Fly to selected truck */}
                            {selectedTruck && selectedTruck.latitude && selectedTruck.longitude && (
                                <MapUpdater center={[selectedTruck.latitude, selectedTruck.longitude]} />
                            )}

                            {trucks.map(truck => (
                                truck.latitude && truck.longitude ? (
                                    <Marker
                                        key={truck.id}
                                        position={[truck.latitude, truck.longitude]}
                                    >
                                        <Popup>
                                            <div className="p-1">
                                                <h3 className="font-bold">{truck.id}</h3>
                                                <p className="text-sm">{truck.driver}</p>
                                                <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${truck.status === 'En Route' ? 'bg-blue-100 text-blue-800' :
                                                    truck.status === 'Collection' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {truck.status}
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ) : null
                            ))}
                        </MapContainer>

                        {/* Info Overlay (Only if selected) */}
                        {selectedTruck && (
                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-lg border border-neutral-200 shadow-lg z-[1000]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-neutral-900">{selectedTruck.id} Details</h3>
                                        <p className="text-sm text-neutral-500">{selectedTruck.driver} • {selectedTruck.location}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={handleContactDriver}>
                                            <Phone className="mr-2 h-4 w-4" /> Contact
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
