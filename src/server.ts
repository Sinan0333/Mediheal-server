import server from "./utils/socketIo";
import connectDB from "./db";


connectDB()

server.listen(process.env.PORT, () => {
    console.log('Server started');
}).on('error', (error: any) => {
    console.error('Error starting the server:', error);
    process.exit(1); 
});
