const asyncHandeler = (func) => {
    return (req, res, next) => {
        Promise
            .resolve(func(req, res, next))
            .catch((err) => console.warn("500 error", err))

    }
}

export default asyncHandeler;