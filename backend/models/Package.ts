import mongoose, { Schema, Types } from "mongoose";

export interface IActivity {
  id: string;
  name: string;

  image: string;
  description: string;
  timing: {
    from: string;
    to: string;
  };
  cost: number;
  customizable: boolean;
}

export interface IOptionalActivity {
  id: string;
  name: string;

  image: string;
  description: string;
  timing: {
    from: string;
    to: string;
  };
  cost: number;
}

export interface IItineraryDay {
  day: number;
  gallery: string[];
  activities: IActivity[];
  optionalActivities: IOptionalActivity[];
}

export interface Ipackage {
  name: string;
  amount: number;
  destinations: Types.ObjectId[];
  duration: {
    day: number;
    night: number;
  };
  specifications: string;
  startDate: Date;
  remark: string;
  discount: number;
  availableSlots: string;
  images: string[];
  category: Types.ObjectId;
  operatorId: Types.ObjectId;
  startPoint: string;
  childPricing: {
    enabled: boolean;
    minAge?: number | undefined;
    maxAge?: number | undefined;
    percentage?: number | undefined;
  };

  itinerary: IItineraryDay[];
}

const ActivitySchema = new Schema<IActivity>(
  {
    id: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    image: {
      required: true,
      type: String,
    },
    timing: {
      from: {
        required: true,
        type: String,
      },
      to: {
        required: true,
        type: String,
      },
    },

    cost: Number,
    customizable: Boolean,
  },
  { _id: false },
);

const OptionalActivitySchema = new Schema<IOptionalActivity>(
  {
    id: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    image: {
      required: true,
      type: String,
    },
    timing: {
      from: {
        required: true,
        type: String,
      },
      to: {
        required: true,
        type: String,
      },
    },

    cost: Number,
  },
  { _id: false },
);

const ItinerarySchema = new Schema<IItineraryDay>(
  {
    day: { type: Number, required: true },
    gallery: { type: [String], required: true },
    activities: { type: [ActivitySchema], required: true },
    optionalActivities: { type: [OptionalActivitySchema], default: [] },
  },
  { _id: false },
);

const packageSchema = new Schema<Ipackage>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    childPricing: {
      enabled: {
        type: Boolean,
        default: false,
      },
      minAge: {
        type: Number,
        required: function () {
          return this.childPricing?.enabled === true;
        },
      },
      maxAge: {
        type: Number,
        required: function () {
          return this.childPricing?.enabled === true;
        },
      },
      percentage: {
        type: Number,
        required: function () {
          return this.childPricing?.enabled === true;
        },
      },
    },

    destinations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Destination",
        required: true,
      },
    ],
    duration: {
      day: {
        type: Number,
        required: true,
      },
      night: {
        type: Number,
        required: true,
      },
    },
    specifications: { type: String },

    startDate: {
      type: Date,
    },
    startPoint: {
      type: String,
      required: true,
    },
    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
    },
    remark: String,

    discount: Number,
    availableSlots: { type: String },
    images: [{ type: String }],
    itinerary: [ItinerarySchema],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PackageCategory",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<Ipackage>("Package", packageSchema);
