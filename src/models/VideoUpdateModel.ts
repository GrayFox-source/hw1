export type VideoUpdateInputModel = {
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    availableResolutions: string[]
    publicationDate: string
}