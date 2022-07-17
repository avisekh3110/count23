const RoutineSubject = ({ subject, topics }) => {
  return (
    <div className="flex flex-col flex-grow bg-slate-800 max-w-xs cursor-pointer border-gray-500 border hover:bg-slate-700 shadow-md rounded-lg duration-100">
      <div className="text-white rounded-t-lg font-semibold text-lg uppercase p-3 duration-150">
        {subject}
      </div>
      <div className="flex flex-col gap-4 px-8 py-4 text-white font-light pl-6 rounded-b-lg">
        {topics.map((topic, idx) => (
          <div key={idx} className="font-light text-sm">
            {topic}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutineSubject;
