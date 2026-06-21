const express = require("express");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;

const app = express();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
