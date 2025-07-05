import React from "react";

export default function AvailabilityCard({ availability, editMode, onChange }) {
  const handleDayChange = (index, value) => {
    const updatedDays = [...availability.days];
    updatedDays[index] = value;
    onChange({ ...availability, days: updatedDays });
  };

  const handleTimeSlotChange = (index, field, value) => {
    const updatedSlots = [...availability.timeSlots];
    updatedSlots[index][field] = value;
    onChange({ ...availability, timeSlots: updatedSlots });
  };

  const addDay = () => onChange({ ...availability, days: [...availability.days, ""] });
  const removeDay = (index) =>
    onChange({ ...availability, days: availability.days.filter((_, i) => i !== index) });

  const addTimeSlot = () =>
    onChange({
      ...availability,
      timeSlots: [...availability.timeSlots, { start: "", end: "" }],
    });

  const removeTimeSlot = (index) =>
    onChange({
      ...availability,
      timeSlots: availability.timeSlots.filter((_, i) => i !== index),
    });

  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border border-blue-500 shadow-xl hover:shadow-blue-300 transition-all duration-400">
      <h2 className="text-lg font-semibold text-orange-400 mb-2">Availability</h2>
      {editMode ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-orange-300 font-semibold">Days</h3>
            {availability.days.map((day, i) => (
              <div key={i} className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={day}
                  onChange={(e) => handleDayChange(i, e.target.value)}
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                />
                <button
                  onClick={() => removeDay(i)}
                  className="text-red-400 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addDay}
              className="text-sm text-blue-300 mt-1 hover:underline"
            >
              + Add Day
            </button>
          </div>

          <div>
            <h3 className="text-orange-300 font-semibold">Time Slots</h3>
            {availability.timeSlots.map((slot, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Start Time"
                  value={slot.start}
                  onChange={(e) => handleTimeSlotChange(i, "start", e.target.value)}
                  className="bg-gray-700 text-white px-2 py-1 rounded"
                />
                <input
                  type="text"
                  placeholder="End Time"
                  value={slot.end}
                  onChange={(e) => handleTimeSlotChange(i, "end", e.target.value)}
                  className="bg-gray-700 text-white px-2 py-1 rounded"
                />
                <div className="col-span-2 text-right">
                  <button
                    onClick={() => removeTimeSlot(i)}
                    className="text-red-400 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={addTimeSlot}
              className="text-sm text-blue-300 mt-1 hover:underline"
            >
              + Add Time Slot
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm">Days: {availability.days.join(", ")}</p>
          <ul className="text-sm mt-1">
            {availability.timeSlots.map((slot, i) => (
              <li key={i}>{slot.start} - {slot.end}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
