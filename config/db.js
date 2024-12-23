import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Conectado ao MongoDB com sucesso!' + mongoURI);
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    }
};
