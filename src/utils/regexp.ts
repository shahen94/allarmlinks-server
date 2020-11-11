export const caseInsExp = (value:string) => {
    return new RegExp('.*'+value+'.*', "i")
 }