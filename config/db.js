import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/local';

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Conectado ao MongoDB com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    }
};
