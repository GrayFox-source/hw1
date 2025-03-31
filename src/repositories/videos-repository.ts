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

const availableRes = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
function isValidDateTimeString(value: unknown): value is string {
    if (typeof value !== "string") {
        return false;
    }

    const date = new Date(value);
    return !isNaN(date.getTime());
}



export const videosRepository = {
    getAllVideos() {
        return db.videos
    },
    getVideoById(id: number) {
        let video = db.videos.find(p => p.id === id)
        return video
    },
    createVideo(createVideoDTO:{availableResolutions: string[], title: string, author: string, canBeDownloaded: boolean, minAgeRestriction: number | null }) {
        const addResolution = createVideoDTO.availableResolutions
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

        if (typeof createVideoDTO.title === 'string') {
            if (createVideoDTO.title.length <= 40) {
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

        if (createVideoDTO.author.length <= 20) {
            validAuthor = true
        } else {
            validAuthor = false
            const fieldError = {
                message: "Invalid Author. Max field length is 20, try again!",
                field: 'author'
            }
            validError.errorsMessages.push(fieldError)
        }

        if (validTitle && validAuthor && createVideoDTO.availableResolutions.length != 0 && validResoulution === true) {
            const newVideo = {
                id: +(new Date()),
                title: createVideoDTO.title,
                author: createVideoDTO.author,
                canBeDownloaded: createVideoDTO.canBeDownloaded || false,
                minAgeRestriction: createVideoDTO.minAgeRestriction || null,
                createdAt: now.toISOString(),
                publicationDate: tomorrow.toISOString(),
                availableResolutions: addResolution
            }
            db.videos.push(newVideo);
            return newVideo
        } else {
            return validError
        }
    },
    updateVideo(updateVideoDTO:{id:number, availableResolutions: string[], title:string, author:string, canBeDownloaded: boolean,
        minAgeRestriction: number | null, publicationDate: string}) {
        const findVideo = db.videos.find(v => v.id === updateVideoDTO.id)
        if (findVideo) {
            const addResolution = updateVideoDTO.availableResolutions
            const validResoulution: boolean = addResolution.every((r:string) => availableRes.includes(r))
            let validTitle: boolean = true
            let validAuthor: boolean = true
            let video = db.videos.find(p => p.id === updateVideoDTO.id)
            let validDownload: boolean = true
            let validMinAgeRestriction: boolean = true
            let validPublicateTime = true
            const validError: {errorsMessages: Record<string, string>[]} = {
                errorsMessages: []
            }

            if (typeof updateVideoDTO.title === 'string') {
                if (updateVideoDTO.title.length <= 40) {
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

            if (updateVideoDTO.author.length <= 20) {
                validAuthor = true
            } else {
                validAuthor = false
                const fieldError = {
                    message: "Invalid Author. Max field length is 20, try again!",
                    field: 'author'
                }
                validError.errorsMessages.push(fieldError)
            }

            if (typeof updateVideoDTO.canBeDownloaded === 'boolean') {
                validDownload = true
            } else {
                validDownload = false
                const fieldError = {
                    message: "Invalid Field. This must be boolean!",
                    field: 'canBeDownloaded'
                }
                validError.errorsMessages.push(fieldError)
            }

            if (typeof updateVideoDTO.minAgeRestriction === 'number'
                && Number.isInteger(updateVideoDTO.minAgeRestriction)
                && updateVideoDTO.minAgeRestriction > 0
                && updateVideoDTO.minAgeRestriction <= 18) {
                validMinAgeRestriction = true
            } else {
                validMinAgeRestriction = false
                const fieldError = {
                    message: "Invalid Field. This must be number with range from 1 to 18!",
                    field: 'minAgeRestriction'
                }
                validError.errorsMessages.push(fieldError)
            }

            if (isValidDateTimeString(updateVideoDTO.publicationDate)) {
                validPublicateTime = true
            } else {
                validPublicateTime = false
                const fieldError = {
                    message: "Invalid Field. This must be ISO date form",
                    field: 'publicationDate'
                }
                validError.errorsMessages.push(fieldError)
            }

            if (video && validAuthor && validTitle && updateVideoDTO.availableResolutions.length != 0 && validResoulution && validDownload && validMinAgeRestriction && validPublicateTime) {
                video.title = updateVideoDTO.title
                video.author = updateVideoDTO.author
                video.availableResolutions = updateVideoDTO.availableResolutions
                video.canBeDownloaded = updateVideoDTO.canBeDownloaded || false
                video.minAgeRestriction = updateVideoDTO.minAgeRestriction || null
                video.publicationDate = updateVideoDTO.publicationDate
                return video;
            } else {
                return validError
            }
        } else {
            return null
        }
    },
    deleteVideo(id: number) {
        for (let i = 0; i < db.videos.length; i++) {
            if (db.videos[i].id === id) {
                db.videos.splice(i, 1)
                return true
            }
        }
        return false
    }
}