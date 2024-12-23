import mongoose from 'mongoose';
export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/local');
        console.log('Conectado ao MongoDB com sucesso!');
    }
    catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    }
};
