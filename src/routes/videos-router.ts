import {Request, Response, Router} from 'express'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types";
import {VideoCreateInputModel} from "../models/VideoCreateModel";
import {VideoViewModel} from "../models/VideoViewModel";
import {ErrorFieldViewModel} from "../models/ErrorFieldViewModel";
import {VideoIdURIparams} from "../models/VideoIdURIparams";
import {VideoUpdateInputModel} from "../models/VideoUpdateModel";

const availableRes = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
function isValidDateTimeString(value: unknown): value is string {
    if (typeof value !== "string") {
        return false;
    }

    const date = new Date(value);
    return !isNaN(date.getTime());
}

type videosType = {
    id: number,
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: string[]
}
export let  db: {videos: videosType[]} = {
    videos: [
        {
            id: 0,
            title: 'string',
            author: 'string',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2025-03-11T13:30:34.891Z",
            publicationDate: "2025-03-11T13:30:34.891Z",
            availableResolutions: [
                "P144"
            ]
        },
        {
            id: 1,
            title: 'string',
            author: 'string',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2025-03-11T13:30:34.891Z",
            publicationDate: "2025-03-11T13:30:34.891Z",
            availableResolutions: [
                "P144"
            ]
        },
    ]

}
export const videosRouter = Router();

videosRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(db.videos)
})

videosRouter.get('/:ID', (req: RequestWithParams<{ID: string}>, res: Response) => {
    let video = db.videos.find(p => p.id === +req.params.ID)
    if (video) {
        res.send(video);
    }
    else {
        res.send(404);
    }
})

videosRouter.post('/', (req: RequestWithBody<VideoCreateInputModel>,
                              res: Response<VideoViewModel | ErrorFieldViewModel>) => {
    const addResolution = req.body.availableResolutions
    const validResoulution: boolean = addResolution.every((r: string) => availableRes.includes(r))
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const validError: {errorsMessages: Record<string, string>[]} = {
        errorsMessages: []
    }
    let validTitle: boolean = true
    let validAuthor: boolean = true

    if (validResoulution === false) {
        const fieldError = {
            message: "Invalid Resolution, field must contain 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160', try again!",
            field: 'availableResolutions'
        }
        validError.errorsMessages.push(fieldError)
    }

    if (typeof req.body.title === 'string') {
        if (req.body.title.length <= 40) {
            validTitle = true
        } else {
            validTitle = false
            const fieldError = {
                message: "Invalid Title. Max field length is 40, try again!",
                field: 'title'
            }
            validError.errorsMessages.push(fieldError)
        }
    } else {
        validTitle = false
        const fieldError = {
            message: "Invalid Title. Max field length is 40, try again!",
            field: 'title'
        }
        validError.errorsMessages.push(fieldError)
    }

    if (req.body.author.length <= 20) {
        validAuthor = true
    } else {
        validAuthor = false
        const fieldError = {
            message: "Invalid Author. Max field length is 20, try again!",
            field: 'author'
        }
        validError.errorsMessages.push(fieldError)
    }

    if (validTitle && validAuthor && req.body.availableResolutions.length != 0 && validResoulution === true) {
        const newVideo = {
            id: +(new Date()),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: req.body.canBeDownloaded || false,
            minAgeRestriction: req.body.minAgeRestriction || null,
            createdAt: now.toISOString(),
            publicationDate: tomorrow.toISOString(),
            availableResolutions: addResolution
        }
        db.videos.push(newVideo);
        res.status(201).send(newVideo)
    } else {
        res.status(400).send(validError)
    }
})

videosRouter.put('/:ID', (req: RequestWithParamsAndBody<VideoIdURIparams, VideoUpdateInputModel>, res: Response) => {
    const findVideo = db.videos.find(v => v.id === +req.params.ID)
    if (findVideo) {
        const addResolution = req.body.availableResolutions
        const validResoulution: boolean = addResolution.every((r:string) => availableRes.includes(r))
        let validTitle: boolean = true
        let validAuthor: boolean = true
        let video = db.videos.find(p => p.id === +req.params.ID)
        let validDownload: boolean = true
        let validMinAgeRestriction: boolean = true
        let validPublicateTime = true
        const validError: {errorsMessages: Record<string, string>[]} = {
            errorsMessages: []
        }

        if (typeof req.body.title === 'string') {
            if (req.body.title.length <= 40) {
                validTitle = true
            } else {
                validTitle = false
                const fieldError = {
                    message: "Invalid Title. Max field length is 40, try again!",
                    field: 'title'
                }
                validError.errorsMessages.push(fieldError)
            }
        } else {
            validTitle = false
            const fieldError = {
                message: "Invalid Title. Max field length is 40, try again!",
                field: 'title'
            }
            validError.errorsMessages.push(fieldError)
        }

        if (req.body.author.length <= 20) {
            validAuthor = true
        } else {
            validAuthor = false
            const fieldError = {
                message: "Invalid Author. Max field length is 20, try again!",
                field: 'author'
            }
            validError.errorsMessages.push(fieldError)
        }

        if (typeof req.body.canBeDownloaded === 'boolean') {
            validDownload = true
        } else {
            validDownload = false
            const fieldError = {
                message: "Invalid Field. This must be boolean!",
                field: 'canBeDownloaded'
            }
            validError.errorsMessages.push(fieldError)
        }

        if (typeof req.body.minAgeRestriction === 'number'
            && Number.isInteger(req.body.minAgeRestriction)
            && req.body.minAgeRestriction > 0
            && req.body.minAgeRestriction <= 18) {
            validMinAgeRestriction = true
        } else {
            validMinAgeRestriction = false
            const fieldError = {
                message: "Invalid Field. This must be number with range from 1 to 18!",
                field: 'minAgeRestriction'
            }
            validError.errorsMessages.push(fieldError)
        }

        if (isValidDateTimeString(req.body.publicationDate)) {
            validPublicateTime = true
        } else {
            validPublicateTime = false
            const fieldError = {
                message: "Invalid Field. This must be ISO date form",
                field: 'publicationDate'
            }
            validError.errorsMessages.push(fieldError)
        }

        if (video && validAuthor && validTitle && req.body.availableResolutions.length != 0 && validResoulution && validDownload && validMinAgeRestriction && validPublicateTime) {
            video.title = req.body.title
            video.author = req.body.author
            video.availableResolutions = req.body.availableResolutions
            video.canBeDownloaded = req.body.canBeDownloaded || false
            video.minAgeRestriction = req.body.minAgeRestriction || null
            video.publicationDate = req.body.publicationDate
            res.status(204).send(video);
        } else {
            res.status(400).send(validError)
        }
    } else {
        res.send(404)
    }

})

videosRouter.delete('/:ID', (req: RequestWithParams<VideoIdURIparams>, res: Response) => {
    for (let i = 0; i < db.videos.length; i++) {
        if (db.videos[i].id === +req.params.ID) {
            db.videos.splice(i, 1)
            res.send(204)
            return
        }
    }
    res.send(404)
})