import React, { useEffect, useState } from "react";
import type { ItineraryDay } from "./types";
import { ImagePlus, Trash2, X } from "lucide-react";
import ActivityEditor from "./ActivityEditor";
import OptionalActivityEditor from "./OptionalActivityEditor";

interface Props {
  value: ItineraryDay;
  onChange: (day: ItineraryDay) => void;
}

const DayEditor = ({ value, onChange }: Props) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleInput = (field: keyof ItineraryDay, fieldValue: any) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const files = Array.from(e.target.files);

    onChange({ ...value, gallery: [...value.gallery, ...files] });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const updated = [...value.gallery];
    updated.splice(index, 1);
    onChange({ ...value, gallery: updated });
  };

  useEffect(() => {
    const urls = value.gallery.map((img) => {
      if (typeof img === "string") {
        return img;
      }

      return URL.createObjectURL(img);
    });

    setPreviews(urls);

    return () => {
      urls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [value.gallery]);

  return (
    <div className="rounded-[30px] bg-linear-to-b from-white to-slate-100 border-[4px] border-white shadow-[0px_20px_20px_5px_rgba(133,189,215,0.88)] p-8 ">
      <div className="space-y-5">
        <div>
          <label className="font-medium ">Title</label>
          <input
            type="text"
            value={value.title}
            onChange={(e) => handleInput("title", e.target.value)}
            className="w-full bg-white px-5 py-4 mt-2 rounded-[20px] shadow-[0px_10px_10px_5px_#cff0ff] focus:outline-none focus:border-l-2 focus:border-r-2 focus:border-cyan-500"
            placeholder="Arrival & Welcome "
          />
        </div>

        <div>
          <label className="font-medium">Description</label>
          <textarea
            value={value.description}
            onChange={(e) => handleInput("description", e.target.value)}
            className="w-full h-32 mt-2 bg-white rounded-[20px] px-5 py-4 shadow-[0px_10px_10px_5px_#cff0ff] resize-none focus:outline-none focus:border-l-2 focus:border-r-2 focus:border-cyan-500 "
            placeholder="Describe today's itinerary..."
          />
        </div>

        <div>
          <label className="font-medium block mb-3">Gallery Images</label>
          <input
            id="gallery"
            hidden
            multiple
            accept="image/*"
            type="file"
            onChange={handleGalleryChange}
          />
          <label
            htmlFor="gallery"
            className=" bg-white flex items-center gap-2 border-2 border-dashed rounded-[20px] p-5 cursor-pointer hover:border-blue-500 shadow-[0px_10px_10px_5px_#cff0ff]"
          >
            <ImagePlus size={22} />
            Upload Images
          </label>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  className="w-28 h-28  rounded-xl border shadow object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-12 w-6 h-6 bg-red-600 text-white flex  items-center justify-center rounded-full"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <ActivityEditor
          onChange={(activities) => onChange({ ...value, activities })}
          value={value.activities}
        />

        <OptionalActivityEditor
          onChange={(optionalActivities) =>
            onChange({ ...value, optionalActivities })
          }
          value={value.optionalActivities}
        />
      </div>
    </div>
  );
};

export default DayEditor;
