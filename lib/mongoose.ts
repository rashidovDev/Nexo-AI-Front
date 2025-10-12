import mongoose from 'mongoose'

let isConnected: boolean = false

export const connectToDatabase = async () => {
	mongoose.set('strictQuery', true)

	const uri = process.env.MONGODB_URI
	if (!uri) {
		return console.error('MONGO_URI is not defined')
	}

	if (isConnected) {
		return
	}

	try {
		await mongoose.connect(uri, { autoCreate: true })
		isConnected = true
	} catch (err) {
		console.log('Error connecting to database', err)
	}
}