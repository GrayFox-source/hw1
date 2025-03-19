export type VideoCreateInputModel = {
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    availableResolutions: string[]
}