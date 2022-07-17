import RoutineDay from "../components/RoutineDay";
import logger from "../utils/logger";

const Routine = ({ routine }) => {
  return (
    <div className="w-full flex flex-col items-center justify-between px-6 pt-20 pb-6 gap-10">
      {Object.keys(routine).map((date, idx) => (
        <RoutineDay key={idx} date={date} subjects={routine[date]} />
      ))}
    </div>
  );
};

export default Routine;

export const getStaticProps = async () => {
  const routineLogger = logger.child({
    name: "routine",
  });
  try {
    const routine = (await import("../public/routine.json")).default;
    routineLogger.info({
      data: { routine },
    });
    return {
      props: {
        routine: routine,
      },
    };
  } catch (err) {
    routineLogger.error(err);
    return {
      props: {
        routine: null,
      },
    };
  }
};
