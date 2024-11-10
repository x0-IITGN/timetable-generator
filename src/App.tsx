import { Show, createResource } from "solid-js";
import "./App.css";

import { Course } from "./types";
// import CourseTable from './CourseTable'
import WeekView from "./WeekView";

const fetchCourses = async () => {
  // const response = await fetch('http://localhost:3000/api/courses');
  const response = await fetch("http://localhost:8080/api/courses");
  const json = await response.json();
  return json as Course[];
};

function App() {
  const [courses] = createResource<Course[]>(fetchCourses);

  return (
    <>
      <hr></hr>

      <Show when={!courses.loading} fallback={<>Loading...</>}>
        <WeekView courses={courses} />
      </Show>

      <hr></hr>

      {/* <CourseTable courses={courses} /> */}
    </>
  );
}

export default App;
