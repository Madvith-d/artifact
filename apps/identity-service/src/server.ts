import app from "./app";


const { port, fetch } = app;



fetch.listen(port);

console.log(`Server running on port ${port}`);

