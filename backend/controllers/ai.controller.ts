import {main} from "../services/ai.service";

const getResultController = async (req: any, res: any) => {
    try {
        const {prompt} = req.query;
        const result = await main(prompt as string);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

export default {getResultController};