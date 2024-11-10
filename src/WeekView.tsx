import {
  Accessor,
  For,
  Match,
  Resource,
  Setter,
  Show,
  Switch,
  createSignal,
} from "solid-js";
import { Course } from "./types";

const slots = [
  ["8:30 – 9:50", "A1", "B1", "A2", "C2", "B2"],
  ["10:00 - 11:20", "C1", "D1", "E1", "D2", "E2"],
  ["11:30 - 12:50", "F1", "G1", "H2", "F2", "G2"],
  ["13:00 - 14:00", "T1", "T2", "T3", "O1", "O2"],
  ["14:00 - 15:20", "I1", "J1", "I2", "K2", "J2"],
  ["15:30 - 16:50", "K1", "L1", "M1", "L2", "M2"],
  ["17:00 - 18:20", "H1", "N1", "P1", "N2", "P2"],
];

interface WeekViewProps {
  courses: Resource<Course[]>;
}

interface SearchableCourseProps {
  courses: Resource<Course[]>;
  selected: Accessor<Course[]>;
  setSelected: Setter<Course[]>;
}

function SearchableCourse({
  courses,
  selected,
  setSelected,
}: SearchableCourseProps) {
  const [searchTerm, setSearchTerm] = createSignal("");

  return (
    <>
      <div class="m-2">
        <input
          class="w-80 border rounded-md p-1"
          type="text"
          placeholder="Search..."
          onInput={(e) => setSearchTerm(e.currentTarget.value)}
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <For each={courses()}>
          {(course) => (
            <Show
              when={
                course.course_code
                  .toLowerCase()
                  .includes(searchTerm().toLowerCase()) ||
                course.course_name
                  .toLowerCase()
                  .includes(searchTerm().toLowerCase())
              }
            >
              <div class="border rounded-lg p-4 shadow-md bg-white text-left">
                <div class="flex justify-between items-center mb-2">
                  <div class="font-bold text-lg">{course.course_code}</div>
                  <input
                    type="checkbox"
                    class="form-checkbox h-5 w-5 text-blue-600"
                    checked={selected().includes(course)}
                    onClick={() =>
                      setSelected((selected) => {
                        if (selected.includes(course)) {
                          return selected.filter(
                            (selectedCourse) => selectedCourse !== course
                          );
                        } else {
                          return [...selected, course];
                        }
                      })
                    }
                  />
                </div>
                <div class="text-gray-700 mb-2">{course.course_name}</div>
                <div class="text-sm">
                  <div class="mb-1">
                    <span class="font-semibold">Instructor:</span>{" "}
                    {course.instructors}
                  </div>
                  <div class="mb-1">
                    <span class="font-semibold">Credits:</span> {course.c}
                  </div>
                  <div class="mb-1">
                    <span class="font-semibold text-blue-600">Lecture:</span>{" "}
                    {course.lecture.map((lecture) => (
                      <span>
                        {lecture.times.join(", ")} : {lecture.location}
                      </span>
                    ))}
                  </div>
                  <div class="mb-1">
                    <span class="font-semibold text-green-600">Tutorial:</span>{" "}
                    {course.tutorial.map((tutorial) => (
                      <span>
                        {tutorial.times.join(", ")} : {tutorial.location}
                      </span>
                    ))}
                  </div>
                  <div class="mb-1">
                    <span class="font-semibold text-red-600">Lab:</span>{" "}
                    {course.lab.map((lab) => (
                      <span>
                        {lab.times.join(", ")} : {lab.location}
                      </span>
                    ))}
                  </div>
                  <div>
                    <a
                      href={course.course_plan.link}
                      target="_blank"
                      class="text-blue-500 underline"
                    >
                      {course.course_plan.display}
                    </a>
                  </div>
                </div>
              </div>
            </Show>
          )}
        </For>
      </div>
    </>
  );
}

function totalCredits(selected: Accessor<Course[]>) {
  let total = 0;
  selected().forEach((course) => {
    total += parseInt(course.c);
  });
  return total;
}

function totalHours(selected: Accessor<Course[]>) {
  let total = 0;
  selected().forEach((course) => {
    total += parseFloat(course.l) + parseFloat(course.t) + parseFloat(course.p);
  });
  return total;
}

function WeekView({ courses }: WeekViewProps) {
  const [selected, setSelected] = createSignal<Course[]>([]);

  return (
    // week view in table format with each day as a column and each row as a time slot of 1 hour 30 minutes
    // Slot	            M	T	W	Th	F
    // 0 8:30 – 9:50	A1	B1	A2	C2	B2
    // 1 10:00 - 11:20	C1	D1	E1	D2	E2
    // 2 11:30 - 12:50	F1	G1	H2	F2	G2
    // 3 13:00 - 14:00	T1	T2	T3	O1	O2
    // 4 14:00 - 15:20	I1	J1	I2	K2	J2
    // 5 15:30 - 16:50	K1	L1	M1	L2	M2
    // 6 17:00 - 18:20	H1	N1	P1	N2	P2
    <>
      <h1>Week View</h1>
      <div class="p-12">
        <div class="overflow-auto">
          <table class="min-w-full table-fixed border-collapse border border-gray-300 text-left">
            <thead>
              <tr class="bg-gray-100 text-gray-800">
                <th class="border border-gray-300 px-4 py-2">Time</th>
                <th class="border border-gray-300 px-4 py-2">Monday</th>
                <th class="border border-gray-300 px-4 py-2">Tuesday</th>
                <th class="border border-gray-300 px-4 py-2">Wednesday</th>
                <th class="border border-gray-300 px-4 py-2">Thursday</th>
                <th class="border border-gray-300 px-4 py-2">Friday</th>
              </tr>
            </thead>
            <tbody>
              <For each={slots}>
                {(slot) => (
                  <tr class="even:bg-gray-50">
                    <td class="border border-gray-300 px-4 py-2 font-medium">
                      {slot[0]}
                    </td>
                    <For each={slot.slice(1)}>
                      {(slot) => (
                        <td class="border border-gray-300 px-4 py-2 break-words">
                          {slot && (
                            <div class="text-sm">
                              {slot}
                              <br />
                              <For each={selected()}>
                                {(course) => (
                                  <Show
                                    when={
                                      course.lecture.some((lecture) =>
                                        lecture.times.includes(slot)
                                      ) ||
                                      course.tutorial.some((tutorial) =>
                                        tutorial.times.includes(slot)
                                      ) ||
                                      course.lab.some((lab) =>
                                        lab.times.includes(slot)
                                      )
                                    }
                                  >
                                    <div class="mt-2">
                                      <span class="font-semibold">
                                        {course.course_code}:
                                      </span>{" "}
                                      {course.course_name}
                                      <br />
                                      <Switch>
                                        <Match
                                          when={course.lecture.some((lecture) =>
                                            lecture.times.includes(slot)
                                          )}
                                        >
                                          <span class="text-blue-600">
                                            {" "}
                                            Lec:{" "}
                                          </span>
                                          {course.lecture
                                            .filter((lecture) =>
                                              lecture.times.includes(slot)
                                            )
                                            .map((lecture) => (
                                              <span>{lecture.location}</span>
                                            ))}
                                        </Match>
                                        <Match
                                          when={course.tutorial.some(
                                            (tutorial) =>
                                              tutorial.times.includes(slot)
                                          )}
                                        >
                                          <span class="text-green-600">
                                            {" "}
                                            Tut:
                                          </span>
                                          {course.tutorial
                                            .filter((tutorial) =>
                                              tutorial.times.includes(slot)
                                            )
                                            .map((tutorial) => (
                                              <span>{tutorial.location}</span>
                                            ))}
                                        </Match>
                                        <Match
                                          when={course.lab.some((lab) =>
                                            lab.times.includes(slot)
                                          )}
                                        >
                                          <span class="text-red-600">
                                            {" "}
                                            Lab:{" "}
                                          </span>
                                          {course.lab
                                            .filter((lab) =>
                                              lab.times.includes(slot)
                                            )
                                            .map((lab) => (
                                              <span>{lab.location}</span>
                                            ))}
                                        </Match>
                                      </Switch>
                                    </div>
                                  </Show>
                                )}
                              </For>
                            </div>
                          )}
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>

      <hr></hr>

      <div class="h-60 overflow-y-scroll border p-2">
        <div class="flex items-center space-x-4">
          <div class="text-2xl">Selected Courses</div>
          <div>Total Credits: {totalCredits(selected)}</div>
          <div>Total hrs/week: {totalHours(selected)}</div>
        </div>
        <For each={selected()}>
          {(course) => (
            <div class="flex items-center mb-2">
              <button
                class="text-red-500"
                onClick={() =>
                  setSelected((selected) =>
                    selected.filter(
                      (selectedCourse) => selectedCourse !== course
                    )
                  )
                }
              >
                X
              </button>
              <div class="ml-2">
                {course.course_code} : {course.course_name} : {course.c}
              </div>
            </div>
          )}
        </For>
      </div>

      {/* <For each={courses()} fallback={<>Loading...</>}>
                {(course) => (
                    <button onClick={() => setSelected((selected) => [...selected, course])}>
                        {course.course_code} - {course.course_name}
                    </button>
                )}
            </For> */}

      <hr></hr>

      <SearchableCourse
        courses={courses}
        selected={selected}
        setSelected={setSelected}
      />
    </>
  );
}

export default WeekView;
