import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Calendar } from '../../components/shared/Calendar';
import { Badge } from '../../components/ui/Badge';
import { Truck, Leaf, Recycle } from 'lucide-react';
export function ResidentSchedule() {
  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Collection Schedule
        </h2>
        <p className="text-neutral-500">
          View upcoming pickups and holiday changes.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>October 2023</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar />
          </CardContent>
        </Card>
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
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-emerald-50 flex items-center justify-center">
                <Leaf className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Compost</div>
                <div className="text-xs text-neutral-500">Every Tuesday</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-forest-50 border-forest-100">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-forest-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-forest-900 text-sm">
                  Holiday Schedule Change
                </h4>
                <p className="text-sm text-forest-700 mt-1">
                  Due to Thanksgiving, pickup will be delayed by one day
                  during the week of Nov 23.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>;
}
import { AlertCircle } from 'lucide-react';