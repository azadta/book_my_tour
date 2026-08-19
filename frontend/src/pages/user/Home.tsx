import HomeSlideThree from "@/components/homeSlideThree/HomeSlideThree";
import HomeSlideTwo from "@/components/homeSlideTwo/HomeSlideTwo";
import HomeSlideTop from "@/components/homeTopSlide/HomeSlideTop";
import HomeImageSlide from "../../components/homeImageSlide/HomeImageSlide";
export const reviewStats = {
  totalReviews: 128,
  averageRating: 4.6,
  avgGuide: 4.8,
  avgValue: 4.5,
  avgItinerary: 4.7,
  avgTransport: 4.4,
  fiveStar: 86,
  fourStar: 28,
  threeStar: 9,
  twoStar: 3,
  oneStar: 2,
};
export const reviews = [
  {
    _id: "1",
    userId: {
      name: "Rahul Menon",
      image: "https://i.pravatar.cc/150?img=12",
    },
    rating: 5,
    travelerType: "Couple",
    createdAt: "2026-06-14T10:30:00Z",
    comment:
      "Amazing experience! The guide was knowledgeable, hotels were clean, and the itinerary was perfectly planned. Athirappilly waterfall was the highlight of our trip.",
    images: [
      "https://picsum.photos/300/300?random=11",
      "https://picsum.photos/300/300?random=12",
      "https://picsum.photos/300/300?random=13",
    ],
  },
  {
    _id: "2",
    userId: {
      name: "Priya Nair",
      image: "https://i.pravatar.cc/150?img=32",
    },
    rating: 5,
    travelerType: "Family",
    createdAt: "2026-05-28T15:20:00Z",
    comment:
      "Our kids loved every destination. Transportation was comfortable and the food arrangements exceeded expectations.",
    images: [
      "https://picsum.photos/300/300?random=14",
      "https://picsum.photos/300/300?random=15",
    ],
  },
  {
    _id: "3",
    userId: {
      name: "Arjun Kumar",
      image: "https://i.pravatar.cc/150?img=25",
    },
    rating: 4,
    travelerType: "Friends",
    createdAt: "2026-04-18T09:10:00Z",
    comment:
      "Very enjoyable tour. Everything was on time. Only wish we had spent a little more time at the beach destination.",
    images: [],
  },
  {
    _id: "4",
    userId: {
      name: "Sneha George",
      image: "https://i.pravatar.cc/150?img=47",
    },
    rating: 5,
    travelerType: "Solo",
    createdAt: "2026-03-08T18:00:00Z",
    comment:
      "As a solo traveler I felt completely safe. The tour guide was friendly and made sure everyone was comfortable.",
    images: ["https://picsum.photos/300/300?random=16"],
  },
  {
    _id: "5",
    userId: {
      name: "Mohammed Shafi",
      image: "https://i.pravatar.cc/150?img=18",
    },
    rating: 4,
    travelerType: "Couple",
    createdAt: "2026-02-21T11:45:00Z",
    comment:
      "Hotels and sightseeing were excellent. The only downside was a slight delay in pickup on the first day.",
    images: [],
  },
  {
    _id: "6",
    userId: {
      name: "Anjali Das",
      image: "https://i.pravatar.cc/150?img=49",
    },
    rating: 5,
    travelerType: "Family",
    createdAt: "2026-01-17T13:15:00Z",
    comment:
      "Worth every penny. Beautiful destinations, well-organized schedule, and excellent customer support throughout the trip.",
    images: [
      "https://picsum.photos/300/300?random=17",
      "https://picsum.photos/300/300?random=18",
      "https://picsum.photos/300/300?random=19",
      "https://picsum.photos/300/300?random=20",
    ],
  },
];

const Home = () => {
  return (
    <div className="mb-5">
      <div className="pt-10 max-w-[1550px] px-5  mx-auto flex flex-col gap-20">
        <HomeImageSlide />
        <HomeSlideTwo />
        <HomeSlideTop />
        <HomeSlideThree />
      </div>
    </div>
  );
};

export default Home;
