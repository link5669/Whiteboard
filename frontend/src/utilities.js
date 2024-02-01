const DEBUG = true

const getUrl = () => {
    if (DEBUG) return "http://localhost:8080"
    else return "https://whiteboard-backend.fly.dev"
}

export { getUrl }