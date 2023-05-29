export const env = () => {
    return JSON.parse(sessionStorage.getItem("env"))
}