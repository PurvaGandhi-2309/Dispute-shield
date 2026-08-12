import dns from "dns";
dns.setServers(['1.1.1.1', '8.8.8.8']);
import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database first, then start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to start server:", err.message);
});
