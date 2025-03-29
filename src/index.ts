import express, {Request, Response} from 'express';
import bodyParser from 'body-parser'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "./types";
import {VideoCreateInputModel} from "./models/VideoCreateModel";
import {VideoUpdateInputModel} from "./models/VideoUpdateModel";
import {VideoViewModel} from "./models/VideoViewModel";
import {ErrorFieldViewModel} from "./models/ErrorFieldViewModel";
import {VideoIdURIparams} from "./models/VideoIdURIparams";
import {db, videosRouter} from "./routes/videos-router";

export const app = express();
const port = process.env.PORT || 3003;

const parseMiddleware = bodyParser({});
app.use(parseMiddleware);
app.use('/videos',videosRouter)

app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.videos = [];
    res.send(204);
})



app.listen(port, () =>  {
    console.log(`Server working on port ${port}`)
})