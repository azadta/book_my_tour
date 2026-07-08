import { Plus } from "lucide-react";
import type { ItineraryDay } from "./types";
import DayEditor from "./DayEditor";

interface Props {
  value: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
}

const createNewDay = (dayNumber: number): ItineraryDay => ({
  day: dayNumber,
  activities: [],
  description: "",
  gallery: [],
  optionalActivities: [],
  title: "",
});

const ItineraryEditor = ({ value, onChange }: Props) => {
  const handleAddDay = () => {
    onChange([...value, createNewDay(value.length + 1)]);
  };

  const handleDeleteDay = (index: number) => {
    const updated = value.filter((_, i) => index !== i);

    const reordered = updated.map((day, index) => ({
      ...day,
      day: index + 1,
    }));

    onChange(reordered);
  };

  const handleUpdateDay = (index: number, updatedDay: ItineraryDay) => {
    const updated = [...value];
    updated[index] = updatedDay;
    onChange(updated);
  };

  return (
    <div className="mt-8 rounded-2xl border bg-linear-to-b from-white to-slate-100 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold ">Package Itenerary</h2>
          <p className="text-sm text-gray-500">
            Create the complete day-wise itinerary
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddDay}
          className="rounded-lg bg-sky-600 px-5  py-2 text-white hover:bg-sky-700"
        >
          + Add Day
        </button>
      </div>

      {value.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
          No itinerary added yet.
        </div>
      )}

      <div className="space-y-6">
        {value.map((day,index)=>(<div key={day.day} className=" rounded-xl border bg-slate-50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Day {day.day}</h3>
          <button type="button" onClick={()=>handleDeleteDay(index)} className="rounded bg-red-600 px-4 py-1 text-white hover:bg-red-700">Delete</button>
        </div>

        <DayEditor value={day} onChange={(updateDay)=>handleUpdateDay(index,updateDay)} />

        </div>))}
      </div>
    </div>
  );
};

export default ItineraryEditor;
