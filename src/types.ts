export type Course = {
  course_code: string;
  course_name: string;
  l: string;
  t: string;
  p: string;
  c: string;
  instructors: string;
  lecture: Slot[];
  tutorial: Slot[];
  lab: Slot[];
  course_plan: Hyperlink;
};

// #[derive(Debug, Serialize, Deserialize)]
// struct Slot {
//     times: Vec<String>,
//     location: String,
// }

export type Slot = {
  times: string[];
  location: string;
};

export enum ClassType {
  Lecture,
  Tutorial,
  Lab,
}

export type Hyperlink = {
  display: string;
  link: string;
};
