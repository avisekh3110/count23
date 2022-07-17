import axios from "axios";
import RoutineDay from "../components/RoutineDay";
import logger from "../utils/logger";

const Routine = ({ routine }) => {
  return (
    <div className="w-full flex flex-col justify-between p-6 gap-4">
      {Object.keys(routine).map((date, idx) => (
        <RoutineDay date={date} subjects={routine[date]} />
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
    const { data: routine } = await axios.get(
      "http://localhost:3000/routine.json"
    );
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
