import { Plus, Trash2 } from "lucide-react";
import type { OptionalActivity } from "./types";

interface Props {
  value: OptionalActivity[];
  onChange: (activities: OptionalActivity[]) => void;
  fieldError: Record<string, string>;
  setFieldError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  dayIndex: number;
}

const OptionalActivityEditor = ({
  value,
  onChange,
  dayIndex,
  fieldError,
  setFieldError,
}: Props) => {
  const addActivity = () => {
    onChange([...value, { id: crypto.randomUUID(), name: "", cost: 0 }]);
  };

  const updateActivity = (
    index: number,
    field: keyof OptionalActivity,
    fieldValue: any,
  ) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  const removeActivity = (index: number) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-5 mt-8">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Optional Activities</h3>
        <button
          type="button"
          onClick={addActivity}
          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg"
        >
          <Plus size={18} /> Add Optional Activity
        </button>
      </div>

      {value.map((activity, index) => (
        <div
          key={activity.id}
          className="border rounded-xl p-5  bg-gray-50 space-y-4"
        >
          <div className="flex justify-between">
            <h4 className="font-medium">Activity {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeActivity(index)}
              className="text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div>
            <label>Name <span className="text-red-500 font-bold">*</span></label>
            <input
              type="text"
              value={activity.name}
              onChange={(e) => {
                updateActivity(index, "name", e.target.value);
                setFieldError((prev) => ({
                  ...prev,
                  [`itinerary.${dayIndex}.optionalActivities.${index}.name`]:
                    "",
                }));
              }}
              className="w-full bg-white px-5 py-4 mt-2 rounded-[20px] shadow-[0px_10px_10px_5px_#cff0ff] focus:outline-none focus:border-l-2 focus:border-r-2 focus:border-cyan-500"
            />
            {fieldError[
              `itinerary.${dayIndex}.optionalActivities.${index}.name`
            ] && (
              <p className="text-red-500 text-sm mt-1">
                {
                  fieldError[
                    `itinerary.${dayIndex}.optionalActivities.${index}.name`
                  ]
                }
              </p>
            )}
          </div>

          <div>
            <label>Cost</label>
            <input
              type="number"
              value={activity.cost}
              onChange={(e) => {
                updateActivity(index, "cost", Number(e.target.value));
                setFieldError((prev) => ({
                  ...prev,
                  [`itinerary.${dayIndex}.optionalActivities.${index}.cost`]:
                    "",
                }));
              }}
              className="w-full bg-white px-5 py-4 mt-2 rounded-[20px] shadow-[0px_10px_10px_5px_#cff0ff] focus:outline-none focus:border-l-2 focus:border-r-2 focus:border-cyan-500"
            />
            {fieldError[
              `itinerary.${dayIndex}.optionalActivities.${index}.cost`
            ] && (
              <p className="text-red-500 text-sm mt-1">
                {
                  fieldError[
                    `itinerary.${dayIndex}.optionalActivities.${index}.cost`
                  ]
                }
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OptionalActivityEditor;
