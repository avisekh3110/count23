import logger from "../../utils/logger";
import { getCookie } from "cookies-next";

const getDataHandler = (req, res) => {
    if(req.method==="GET"){
        const date = new Date();
        const year = date.getFullYear();
        const daysTillDec31 = new Date(year, 12, 1).getTime() - date.getTime();
        const daysLeft = Math.floor(daysTillDec31 / (1000 * 60 * 60 * 24));
        logger.info({ data: { daysLeft } });
        res.send({ daysLeft });
    }
}
export default getDataHandler;