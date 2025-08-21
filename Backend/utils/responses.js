const badRequest = (res, message) => res.status(400).json({ message });
const goodRequest = (res, data, message) => res.status(200).json({ data, message });
const notFound = (res, message) => res.status(404).json({ message });

module.exports = { badRequest, goodRequest, notFound };