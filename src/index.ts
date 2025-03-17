import express, {Request, Response} from 'express';
import bodyParser from 'body-parser'

export const app = express();
const port = process.env.PORT || 3003;
const availableRes = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
let db = {
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

function isValidDateTimeString(value: unknown): value is string {
    if (typeof value !== "string") {
        return false;
    }

    const date = new Date(value);
    return !isNaN(date.getTime());
}

const parseMiddleware = bodyParser({});
app.use(parseMiddleware);


app.get('/hometask_01/api/videos', (req: Request, res: Response) => {
    res.status(200).send(db.videos)
})
app.get('/hometask_01/api/videos/:ID', (req: Request, res: Response) => {
    let video = db.videos.find(p => p.id === +req.params.ID)
    if (video) {
        res.send(video);
    }
    else {
        res.send(404);
    }
})

app.post('/hometask_01/api/videos', (req: Request, res: Response) => {
    const addResolution = req.body.availableResolutions
    const validResoulution: boolean = addResolution.some((r:string) => availableRes.includes(r))

    let validTitle: boolean = true

    let validAuthor: boolean = true
    if (req.body.title.length <= 40) {
        validTitle = true
    } else {
        validTitle = false
    }

    if (req.body.author.length <= 20) {
        validAuthor = true
    } else {
        validAuthor = false
    }

    if (validTitle && validAuthor && req.body.availableResolutions.length != 0 && validResoulution) {
        const newVideo = {
            id: +(new Date()),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: req.body.canBeDownloaded || false,
            minAgeRestriction: req.body.minAgeRestriction || null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: addResolution
        }
        db.videos.push(newVideo);
        res.status(200).send(newVideo)
    } else {
        if (!validResoulution) {
            const fieldError = {
                message: "Invalid Resolution, field must contain 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160', try again!",
                field: req.body.availableResolutions
            }
            res.status(400).send(fieldError)
            return
        }
        if (!validTitle) {
            const fieldError = {
                message: "Invalid Title. Max field length is 40, try again!",
                field: req.body.title
            }
            res.status(400).send(fieldError)
            return
        }
        else {
            const fieldError = {
                message: "Invalid Author. Max field length is 20, try again!",
                field: req.body.author
            }
            res.status(400).send(fieldError)
            return
        }
        }

    })

app.put('/hometask_01/api/videos/:ID', (req: Request, res: Response) => {
    const addResolution = req.body.availableResolutions
    const validResoulution: boolean = addResolution.some((r:string) => availableRes.includes(r))
    let validTitle: boolean = true
    let validAuthor: boolean = true
    let video = db.videos.find(p => p.id === +req.params.ID)
    let validDownload: boolean = true
    let validMinAgeRestriction: boolean = true
    let validPublicateTime = true


    if (req.body.title.length <= 40) {
        validTitle = true
    } else {
        validTitle = false
    }

    if (req.body.author.length <= 20) {
        validAuthor = true
    } else {
        validAuthor = false
    }

    if (typeof req.body.canBeDownloaded === 'boolean') {
        validDownload = true
    } else {
        validDownload = false
    }

    if (typeof req.body.minAgeRestriction === 'number'
        && Number.isInteger(req.body.minAgeRestriction)
        && req.body.minAgeRestriction > 0
        && req.body.minAgeRestriction <= 18) {
        validMinAgeRestriction = true
    } else {
        validMinAgeRestriction = false
    }

    if (isValidDateTimeString(req.body.publicationDate)) {
        validPublicateTime = true
    } else {
        validPublicateTime = false
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
        if (!validResoulution) {
            const fieldError = {
                message: "Invalid Resolution, field must contain 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160', try again!",
                field: req.body.availableResolutions
            }
            res.status(400).send(fieldError)
            return
        }
        if (!validTitle) {
            const fieldError = {
                message: "Invalid Title. Max field length is 40, try again!",
                field: req.body.title
            }
            res.status(400).send(fieldError)
            return
        }
        if (!validAuthor) {
            const fieldError = {
                message: "Invalid Author. Max field length is 20, try again!",
                field: req.body.author
            }
            res.status(400).send(fieldError)
            return
        }
        if (!validDownload) {
            const fieldError = {
                message: "Invalid rule for download. Must be true or false",
                field: req.body.canBeDownloaded
            }
            res.status(400).send(fieldError)
            return
        }
        if (!validPublicateTime) {
            const fieldError = {
                message: "Invalid Publication time. Must be ISO format date-time",
                field: req.body.publicationDate
            }
            res.status(400).send(fieldError)
            return
        } if (!validMinAgeRestriction) {
            const fieldError = {
                message: "Invalid Min Age Restiction. Must be from 1 to 18",
                field: req.body.minAgeRestriction
            }
            res.status(400).send(fieldError)
            return
        } else {
            res.send(404)
        }
    }
})

app.delete('/hometask_01/api/videos/:ID', (req: Request, res: Response) => {
    for (let i = 0; i < db.videos.length; i++) {
        if (db.videos[i].id === +req.params.ID) {
            db.videos.splice(i, 1)
            res.send(204)
            return
        }
    }
    res.send(404)
})

app.delete('/hometask_01/api/testing/all-data', (req: Request, res: Response) => {
    db.videos = [];
    res.send(204);
})



app.listen(port, () =>  {
    console.log(`Server working on port ${port}`)
})