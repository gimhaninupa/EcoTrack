import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/ui/Modal';

export function ResidentSettings() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '(555) 123-4567'
  });

  // Update profile data when user loads
  React.useEffect(() => {
    if (user) {
      const [first, last] = user.name.split(' ');
      setProfileData(prev => ({
        ...prev,
        firstName: first || '',
        lastName: last || '',
        email: user.email
      }));
    }
  }, [user]);

  /* Billing Tab Logic */
  const [cards, setCards] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/24' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [formData, setFormData] = useState({ number: '', expiry: '', cvc: '' });

  const handleOpenModal = (card?: any) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        number: `**** **** **** ${card.last4}`,
        expiry: card.expiry,
        cvc: '***'
      });
    } else {
      setEditingCard(null);
      setFormData({ number: '', expiry: '', cvc: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCard) {
      setCards(cards.map(c => c.id === editingCard.id ? {
        ...c,
        last4: formData.number.slice(-4) || c.last4,
        expiry: formData.expiry
      } : c));
    } else {
      setCards([...cards, {
        id: Date.now(),
        type: 'Visa', // Mock detection
        last4: formData.number.slice(-4) || '1234',
        expiry: formData.expiry || '12/25'
      }]);
    }
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-neutral-500">Loading settings...</div>;
  }

  return <div className="max-w-4xl space-y-6">
    {/* ... Header ... */}
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
      <p className="text-neutral-500">
        Manage your account preferences and billing details.
      </p>
    </div>

    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing">Billing Method</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              />
            </div>
            <Input
              label="Email Address"
              value={profileData.email}
              disabled
              className="bg-neutral-50"
            />
            <Input
              label="Phone Number"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />
            <div className="pt-2">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Pickup Reminders', 'Service Alerts', 'Billing Updates', 'Marketing'].map(item => <div key={item} className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">{item}</span>
              <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-forest-600 focus:ring-forest-500" defaultChecked />
            </div>)}
            <div className="pt-2">
              <Button>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="billing">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cards.map(card => (
              <div key={card.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 bg-neutral-100 rounded flex items-center justify-center text-xs font-bold">
                    {card.type.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {card.type} ending in {card.last4}
                    </div>
                    <div className="text-xs text-neutral-500">
                      Expires {card.expiry}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(card)}>
                  Edit
                </Button>
              </div>
            ))}

            <Button variant="outline" className="w-full" onClick={() => handleOpenModal()}>
              Add New Payment Method
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={editingCard ? 'Edit Payment Method' : 'Add Payment Method'}
    >
      <form onSubmit={handleSaveCard} className="space-y-4 mt-4">
        <Input
          label="Card Number"
          placeholder="0000 0000 0000 0000"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiry Date"
            placeholder="MM/YY"
            value={formData.expiry}
            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
            required
          />
          <Input
            label="CVC"
            placeholder="123"
            value={formData.cvc}
            onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">
            Save Card
          </Button>
        </div>
      </form>
    </Modal>
  </div>;
}