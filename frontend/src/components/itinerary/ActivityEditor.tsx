import { Plus, Trash2 } from "lucide-react";
import type { Activity } from "./types";

interface Props {
  value: Activity[];
  onChange: (activities: Activity[]) => void;
  fieldError: Record<string, string>;
  setFieldError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  dayIndex: number;
}

const ActivityEditor = ({
  value,
  onChange,
  fieldError,
  setFieldError,
  dayIndex,
}: Props) => {
  const addActivity = () => {
    onChange([
      ...value,
      { id: crypto.randomUUID(), name: "", cost: 0, customizable: false },
    ]);
  };

  const updateActivity = (
    index: number,
    field: keyof Activity,
    fieldValue: any,
  ) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  const removeActivity = (index: number) => {
    if (index === 0) {
      return;
    }
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Activities</h3>
        <button
          type="button"
          onClick={addActivity}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg"
        >
          <Plus size={18} /> Add Activity
        </button>
      </div>

      {value.map((activity, index) => (
        <div
          key={activity.id}
          className="border rounded-xl p-5  bg-gray-50 space-y-4"
        >
          <div className="flex justify-between">
            <h4 className="font-medium">Activity {index + 1}</h4>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeActivity(index)}
                className="text-red-600"
              >
                <Trash2 size={18} />
              </button>
            )}
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
                  [`itinerary.${dayIndex}.activities.${index}.name`]: "",
                }));
              }}
              className="w-full bg-white px-5 py-4 mt-2 rounded-[20px] shadow-[0px_10px_10px_5px_#cff0ff] focus:outline-none focus:border-l-2 focus:border-r-2 focus:border-cyan-500"
            />
            {fieldError[`itinerary.${dayIndex}.activities.${index}.name`] && (
              <p className="text-red-500 text-sm mt-1">
                {fieldError[`itinerary.${dayIndex}.activities.${index}.name`]}
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
                  [`itinerary.${dayIndex}.activities.${index}.cost`]: "",
                }));
              }}
              className="w-full bg-white px-5 py-4 mt-2 rounded-[20px] shadow-[0px_10px_10px_5px_#cff0ff] focus:outline-none focus:border-l-2 focus:border-r-2 focus:border-cyan-500"
            />
            {fieldError[`itinerary.${dayIndex}.activities.${index}.cost`] && (
              <p className="text-red-500 text-sm mt-1">
                {fieldError[`itinerary.${dayIndex}.activities.${index}.cost`]}
              </p>
            )}
          </div>

          <label className="flex gap-3 items-center ">
            <input
              type="checkbox"
              checked={activity.customizable}
              onChange={(e) =>
                updateActivity(index, "customizable", e.target.checked)
              }
            />
            Customizable
          </label>
        </div>
      ))}
    </div>
  );
};

export default ActivityEditor;
