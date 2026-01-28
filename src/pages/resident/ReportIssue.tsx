import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Upload, X } from 'lucide-react';
export function ResidentReportIssue() {
  const [images, setImages] = useState<string[]>([]);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Mock upload
      const url = URL.createObjectURL(e.target.files[0]);
      setImages([...images, url]);
    }
  };
  return <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Report an Issue</h2>
        <p className="text-neutral-500">
          Let us know about missed pickups, damaged bins, or other concerns.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <Select label="Issue Type" options={[{
            value: 'missed',
            label: 'Missed Pickup'
          }, {
            value: 'damaged',
            label: 'Damaged Bin'
          }, {
            value: 'illegal',
            label: 'Illegal Dumping'
          }, {
            value: 'other',
            label: 'Other'
          }]} />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700">
                Description
              </label>
              <textarea className="flex min-h-[120px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="Please describe the issue in detail..." />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-700">
                Photos
              </label>
              <div className="grid grid-cols-3 gap-4">
                {images.map((src, i) => <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-neutral-200 group">
                    <img src={src} alt="Upload" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                  </div>)}
                <label className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-neutral-200 hover:border-sky-500 hover:bg-sky-50 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 text-neutral-400 mb-2" />
                  <span className="text-xs text-neutral-500">Upload Photo</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
              <Button type="submit">Submit Report</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>;
}