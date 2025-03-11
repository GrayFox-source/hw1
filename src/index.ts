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
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: (new Date()).toString(),
            publicationDate: (new Date()).toString(),
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

app.delete('/vid/data', (req: Request, res: Response) => {
    db.videos = [];
    res.send(204);
})



app.listen(port, () =>  {
    console.log(`Server working on port ${port}`)
})