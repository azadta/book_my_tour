import { ImagePlus, Plus, Trash2, X } from "lucide-react";
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
      {
        id: crypto.randomUUID(),
        name: "",

        description: "",
        image: "",
        timing: { from: "", to: "" },
        cost: 0,
        customizable: false,
      },
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

      {value.map((activity, index) => {
        const imageInputId = `activity-image-${dayIndex}-${index}`;
        const previewUrl =
          activity.image instanceof File
            ? URL.createObjectURL(activity.image)
            : typeof activity.image === "string"
              ? activity.image
              : "";
        return (
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
              <label>
                Name <span className="text-red-500 font-bold">*</span>
              </label>
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
              <label className="font-medium">
                Description <span className="text-red-500 font-bold">*</span>
              </label>
              <textarea
                value={activity.description}
                onChange={(e) => {
                  updateActivity(index, "description", e.target.value);
                  setFieldError((prev) => ({
                    ...prev,
                    [`itinerary.${dayIndex}.activities.${index}.description`]:
                      "",
                  }));
                }}
                className="w-full h-32 mt-2 bg-white rounded-[20px] px-5 py-4 shadow-[0px_10px_10px_5px_#cff0ff] resize-none focus:outline-none focus:border-l-2 focus:border-r-2 focus:border-cyan-500 "
                placeholder="Describe this activity..."
              />
              {fieldError[
                `itinerary.${dayIndex}.activities.${index}.description`
              ] && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    fieldError[
                      `itinerary.${dayIndex}.activities.${index}.description`
                    ]
                  }
                </p>
              )}
            </div>
            <div>
              <label className="font-medium block mb-2">
                Activity Image<span className="text-red-500 font-bold">*</span>
              </label>
              <input
                id={imageInputId}
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    updateActivity(index, "image", e.target.files[0]);
                    setFieldError((prev) => ({
                      ...prev,
                      [`itinerary.${dayIndex}.activities.${index}.image`]: "",
                    }));
                  }
                }}
              />
            
              <label
                htmlFor={imageInputId}
                className="bg-white flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-[20px] p-4 cursor-pointer hover:border-cyan-500 shadow-[0px_10px_10px_5px_#cff0ff] transition"
              >
                <ImagePlus size={20} className="text-cyan-600" />
                <span className="font-medium text-gray-700">
                  Upload Activity Image
                </span>
              </label>
                {fieldError[
                `itinerary.${dayIndex}.activities.${index}.image`
              ] && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    fieldError[
                      `itinerary.${dayIndex}.activities.${index}.image`
                    ]
                  }
                </p>
              )}
              {previewUrl && (
                <div className="relative mt-3 inline-block">
                  <img
                    src={previewUrl}
                    alt="Activity Preview"
                    className="w-24 h-24 rounded-xl  border shadow object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => updateActivity(index, "image", "")}
                    className="absolute top-1 rigt-1 w-5 h-5 bg-red-500 text-white flex items-center justify-center rounded-full shadow hover:bg-red-700"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium">
                  From Time <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="time"
                  value={activity?.timing?.from || ""}
                  onChange={(e) => {
                    updateActivity(index, "timing", {
                      ...activity.timing,
                      from: e.target.value,
                    });
                    setFieldError((prev) => ({
                      ...prev,
                      [`itinerary.${dayIndex}.activities.${index}.timing.from`]:
                        "",
                    }));
                  }}
                  className="w-full bg-white px-5 py-4 mt-2 rounded-[20px] shadow-[0px_10px_10px_5px_#cff0ff] focus:outline-none focus:border-l-2 focus:border-r-2 focus:border-cyan-500"
                />
                {fieldError[
                  `itinerary.${dayIndex}.activities.${index}.timing.from`
                ] && (
                  <p className="text-red-500 text-sm mt-1">
                    {
                      fieldError[
                        `itinerary.${dayIndex}.activities.${index}.timing.from`
                      ]
                    }
                  </p>
                )}
              </div>
              <div>
                <label className="font-medium">
                  To Time <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="time"
                  value={activity?.timing?.to || ""}
                  onChange={(e) => {
                    updateActivity(index, "timing", {
                      ...activity.timing,
                      to: e.target.value,
                    });
                    setFieldError((prev) => ({
                      ...prev,
                      [`itinerary.${dayIndex}.activities.${index}.timing.to`]:
                        "",
                    }));
                  }}
                  className="w-full bg-white px-5 py-4 mt-2 rounded-[20px] shadow-[0px_10px_10px_5px_#cff0ff] focus:outline-none focus:border-l-2 focus:border-r-2 focus:border-cyan-500"
                />
                {fieldError[
                  `itinerary.${dayIndex}.activities.${index}.timing.to`
                ] && (
                  <p className="text-red-500 text-sm mt-1">
                    {
                      fieldError[
                        `itinerary.${dayIndex}.activities.${index}.timing.to`
                      ]
                    }
                  </p>
                )}
              </div>
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
        );
      })}
    </div>
  );
};

export default ActivityEditor;
