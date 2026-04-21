"use client";

import React from "react";
import { MapPin, Train, Car, Building2 } from "lucide-react";
import { SectionHeader, FieldLabel, Input, Textarea } from "./ui";

export function VenueSection() {
    return (
        <section>
            <SectionHeader
                number="05"
                label="Venue & Getting There"
                icon={<MapPin className="w-3.5 h-3.5" />}
            />

            <div className="space-y-5">
                {/* Venue name + city */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <FieldLabel>Venue Name</FieldLabel>
                        <Input
                            name="location"
                            required
                            placeholder="E.g. Alhamra Arts Council, Lahore"
                        />
                    </div>
                    <div>
                        <FieldLabel optional>City</FieldLabel>
                        <Input name="city" placeholder="Lahore" />
                    </div>
                </div>

                {/* Full address */}
                <div>
                    <FieldLabel optional>Full Address</FieldLabel>
                    <Input
                        name="address"
                        placeholder="4 Pennsylvania Plaza, New York, NY 10001"
                    />
                </div>

                {/* Transport + Parking */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <FieldLabel optional>
                            <Train className="w-3 h-3" /> Public Transport
                        </FieldLabel>
                        <Textarea
                            name="transport"
                            rows={3}
                            placeholder="A, C, E trains to 34th St–Penn Station"
                        />
                    </div>
                    <div>
                        <FieldLabel optional>
                            <Car className="w-3 h-3" /> Parking
                        </FieldLabel>
                        <Textarea
                            name="parking"
                            rows={3}
                            placeholder="MSG Parking Garage — ₨500/night"
                        />
                    </div>
                </div>

                {/* Venue notes */}
                <div>
                    <FieldLabel optional>
                        <Building2 className="w-3 h-3" /> Additional Venue Notes
                    </FieldLabel>
                    <Textarea
                        name="venueNotes"
                        rows={2}
                        placeholder="Accessibility info, landmarks, entrance gate details..."
                    />
                </div>
            </div>
        </section>
    );
}
