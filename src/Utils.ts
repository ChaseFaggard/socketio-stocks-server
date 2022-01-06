export const getDateFromStr = (date: string) => {
    const arr = date.split(/-|s|:/)
    return new Date(+arr[0], +arr[1] -1, +arr[2], +arr[3], +arr[4], +arr[5])
}