export type CarItem = {
  id: string;
  brand: string;
  model: string;
  image: string;
  focusX: number;
  focusY: number;
};

export const CARS: CarItem[] = [
  {
    id: "sample-1",
    brand: "سيارة تجريبية",
    model: "أ",
    image: "/images/cars/sample-1.jpg",
    focusX: 85,
    focusY: 50,
  },
  {
    id: "sample-2",
    brand: "سيارة تجريبية",
    model: "ب",
    image: "/images/cars/sample-2.jpg",
    focusX: 28,
    focusY: 68,
  },
  {
    id: "sample-3",
    brand: "سيارة تجريبية",
    model: "ج",
    image: "/images/cars/sample-3.jpg",
    focusX: 55,
    focusY: 35,
  },
  {
    id: "sample-4",
    brand: "سيارة تجريبية",
    model: "د",
    image: "/images/cars/sample-4.jpg",
    focusX: 72,
    focusY: 70,
  },
];
