import {Request, Response, Router} from 'express'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types";
import {VideoCreateInputModel} from "../models/VideoCreateModel";
import {VideoViewModel} from "../models/VideoViewModel";
import {ErrorFieldViewModel} from "../models/ErrorFieldViewModel";
import {VideoIdURIparams} from "../models/VideoIdURIparams";
import {VideoUpdateInputModel} from "../models/VideoUpdateModel";
import {videosRepository} from "../repositories/videos-repository";
import {type} from "os";





export const videosRouter = Router();

videosRouter.get('/', (req: Request, res: Response) => {
    const videos = videosRepository.getAllVideos()
    res.status(200).send(videos)
})

videosRouter.get('/:ID', (req: RequestWithParams<{ID: string}>, res: Response) => {
    let video = videosRepository.getVideoById(+req.params.ID)
    if (video) {
        res.send(video);
    }
    else {
        res.send(404);
    }
})

videosRouter.post('/', (req: RequestWithBody<VideoCreateInputModel>,
                              res: Response<VideoViewModel | ErrorFieldViewModel>) => {
    const createVideo = videosRepository.createVideo(req.body)
    if ("errorsMessages" in createVideo) {
        res.status(400).send(createVideo)
    } else {
        res.status(201).send(createVideo)
    }
})

videosRouter.put('/:ID', (req: RequestWithParamsAndBody<VideoIdURIparams, VideoUpdateInputModel>, res: Response) => {
        const updateVideo = videosRepository.updateVideo({id: +req.params.ID,...req.body})
        if (updateVideo !== null && "errorsMessages" in updateVideo) {
            res.status(400).send(updateVideo)
        } if (updateVideo === null) {
            res.send(404)
        } else {
            res.status(204).send(updateVideo);
    }
})

videosRouter.delete('/:ID', (req: RequestWithParams<VideoIdURIparams>, res: Response) => {
    const deleteVideo = videosRepository.deleteVideo(+req.params.ID)
    if (deleteVideo) {
        res.send(204)
    } else {
        res.send(404)
    }
})