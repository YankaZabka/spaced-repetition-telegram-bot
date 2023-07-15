import * as mongoose from 'mongoose';
const connectMongoDBAtlas = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env['MONGODB_USERNAME']}:${process.env['MONGODB_PASSWORD']}@cluster1.tilocdq.mongodb.net/?retryWrites=true&w=majority`,
    );
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error when connecting to mongodb: ', error);
  }
};

export default connectMongoDBAtlas;
