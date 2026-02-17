import React, { useState } from 'react';
import { addDays, startOfWeek, addWeeks, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Calendar } from '../../components/shared/Calendar';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Truck, Leaf, Recycle, AlertCircle, Plus, MapPin, Edit2, Trash2 } from 'lucide-react';
import { useService, WASTE_PRICES, Pickup } from '../../context/ServiceContext';

export function ResidentSchedule() {
  const { pickups, schedulePickup, updatePickup, deletePickup, trucks } = useService();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPickup, setEditingPickup] = useState<string | null>(null); // ID of pickup being edited
  const [date, setDate] = useState('');
  const [type, setType] = useState('Waste');
  const [location, setLocation] = useState('');
  const [selectedTruckId, setSelectedTruckId] = useState('');

  // Combine mock recurring events with real scheduled pickups for the calendar
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today);
  const recurringEvents = Array.from({ length: 12 }, (_, i) => {
    return addWeeks(addDays(startOfCurrentWeek, 2), i);
  });

  const allEvents = [
    ...recurringEvents,
    ...pickups.map(p => p.date)
  ];

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (date && location) {
      if (editingPickup) {
        // Update existing
        await updatePickup(editingPickup, {
          date: new Date(date).toISOString(),
          type: type as any,
          location,
          truckId: selectedTruckId || undefined
        });
      } else {
        // Create new
        schedulePickup(new Date(date), type as any, location, selectedTruckId);
      }
      closeModal();
    }
  };

  const openEditModal = (pickup: Pickup) => {
    setEditingPickup(pickup.id);
    setDate(new Date(pickup.date).toISOString().split('T')[0]);
    setType(pickup.type);
    setLocation(pickup.location);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPickup(null);
    setDate('');
    setLocation('');
    setSelectedTruckId('');
  };

  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you want to cancel this pickup?')) {
      await deletePickup(id);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Collection Schedule
            </h2>
            <p className="text-neutral-500">
              View upcoming pickups and holiday changes.
            </p>
          </div>
          <Button onClick={() => { setEditingPickup(null); setIsModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Request
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Calendar events={allEvents} />
              </CardContent>
            </Card>

            {/* Upcoming Pickups List */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Your Scheduled Pickups</h3>
              {pickups.length === 0 ? (
                <div className="text-neutral-500 italic">No extra pickups scheduled.</div>
              ) : (
                <div className="space-y-3">
                  {pickups.map(pickup => (
                    <Card key={pickup.id} className="bg-white">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 index-center justify-center rounded-full flex items-center 
                          ${pickup.type === 'Recycling' ? 'bg-forest-50 text-forest-600' : 'bg-neutral-100 text-neutral-600'}`}>
                            {pickup.type === 'Recycling' ? <Recycle className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="font-medium">{pickup.type} Collection</div>
                            <div className="text-sm text-neutral-500">{format(pickup.date, 'MMMM d, yyyy')}</div>
                            {pickup.location && (
                              <div className="flex items-center text-xs text-neutral-400 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {pickup.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${pickup.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            pickup.status === 'Missed' ? 'bg-red-100 text-red-800' :
                              pickup.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-neutral-100 text-neutral-800'}`}>
                          {pickup.status}
                        </span>
                        {pickup.status === 'Scheduled' && (
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-500 hover:text-neutral-900" onClick={() => openEditModal(pickup)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleCancel(pickup.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </CardContent>

                      {/* Progress Bar */}
                      <div className="px-4 pb-4">
                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${pickup.status === 'Missed' ? 'bg-red-500' : 'bg-forest-500'
                              }`}
                            style={{
                              width: pickup.status === 'Completed' ? '100%' :
                                pickup.status === 'In Progress' ? '60%' :
                                  pickup.status === 'Missed' ? '100%' : '15%'
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-neutral-400 uppercase font-medium tracking-wider">
                          <span>Scheduled</span>
                          <span>In Progress</span>
                          <span>Completed</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-neutral-100 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-neutral-900" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Trash</div>
                    <div className="text-xs text-neutral-500">Every Tuesday</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-forest-50 flex items-center justify-center">
                    <Recycle className="h-4 w-4 text-forest-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Recycling</div>
                    <div className="text-xs text-neutral-500">
                      Every other Tuesday
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div >

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingPickup ? "Edit Pickup Request" : "Schedule Extra Pickup"}
          description="Request an additional collection for bulk items or missed pickups."
        >
          <form onSubmit={handleSchedule} className="space-y-4 mt-4">
            <Input
              label="Pickup Date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <Select
              label="Waste Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { label: `General Waste (LKR ${WASTE_PRICES['Waste']})`, value: 'Waste' },
                { label: `Recycling (LKR ${WASTE_PRICES['Recycling']})`, value: 'Recycling' },
                { label: `Hazardous Materials (LKR ${WASTE_PRICES['Hazardous']})`, value: 'Hazardous' },
                { label: `Organic / Yard (LKR ${WASTE_PRICES['Organic']})`, value: 'Organic' }
              ]}
            />
            <Select
              label="Select Driver / Vehicle (Optional)"
              value={selectedTruckId}
              onChange={(e) => setSelectedTruckId(e.target.value)}
              options={[
                { label: 'Any Available Driver', value: '' },
                ...trucks.map(t => ({
                  label: `${t.driver} (${t.vehicleNumber}) - ${t.status}`,
                  value: t.id || ''
                }))
              ]}
            />
            <Input
              label="Pickup Location"
              placeholder="e.g. 123 Main St, Meepe"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <div className="bg-neutral-50 p-3 rounded-md flex justify-between items-center text-sm">
              <span className="text-neutral-600">Estimated Cost:</span>
              <span className="font-semibold text-forest-700">LKR {WASTE_PRICES[type as keyof typeof WASTE_PRICES].toFixed(2)}</span>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" type="button" onClick={closeModal}>Cancel</Button>
              <Button type="submit">{editingPickup ? "Save Changes" : "Schedule Pickup"}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </>

  );
}