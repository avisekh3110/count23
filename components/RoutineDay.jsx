import { formatDistance, formatDistanceToNow } from "date-fns";
import RoutineSubject from "./RoutineSubject.jsx";

const RoutineDay = ({ date, subjects }) => {
  const routineDate = new Date(date.split(".").reverse().join("-"));
  const now = new Date();
  return (
    <div className="w-full bg-slate-900 hover:bg-slate-800 px-6 py-4 rounded-xl border border-gray-800 duration-75">
      <div className="flex gap-4 items-baseline">
        <div className="flex gap-4 text-white font-black text-lg">
          {routineDate.toDateString()}
        </div>
        <div className="text-sm font-light text-gray-500">
          {`${formatDistanceToNow(routineDate)} ${
            now > routineDate ? "ago" : ""
          } from now`}
        </div>
      </div>
      <div className="flex flex-wrap w-full gap-4 px-6 py-4">
        {Object.keys(subjects).map((subject, idx) => (
          <RoutineSubject
            key={idx}
            subject={subject}
            topics={subjects[subject]}
          />
        ))}
      </div>
    </div>
  );
};

export default RoutineDay;
