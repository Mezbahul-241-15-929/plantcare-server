const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = 'mongodb+srv://mezbahul:2A3NW9ZuLLtGXaGu@cluster0.1jlx3rd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const databaseName = 'plantDB';
const collectionName = 'coffees';

app.use(cors());
app.use(express.json());

let client;
let collectionPromise;

function getPlantCollection() {
  if (!collectionPromise) {
    client = new MongoClient(mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    collectionPromise = client.connect().then(() => {
      console.log('Connected to MongoDB');
      return client.db(databaseName).collection(collectionName);
    });
  }

  return collectionPromise;
}

function getObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'Plant Care API' });
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/plants', async (req, res, next) => {
  try {
    const result = await (await getPlantCollection()).insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/plants', async (req, res, next) => {
  try {
    const result = await (await getPlantCollection()).find().toArray();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/plants/:id', async (req, res, next) => {
  try {
    const id = getObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid plant id' });

    const result = await (await getPlantCollection()).findOne({ _id: id });
    if (!result) return res.status(404).json({ message: 'Plant not found' });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.delete('/plants/:id', async (req, res, next) => {
  try {
    const id = getObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid plant id' });

    const result = await (await getPlantCollection()).deleteOne({ _id: id });
    if (!result.deletedCount) return res.status(404).json({ message: 'Plant not found' });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.put('/plants/:id', async (req, res, next) => {
  try {
    const id = getObjectId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid plant id' });

    const result = await (await getPlantCollection()).updateOne(
      { _id: id },
      { $set: req.body },
      { upsert: false },
    );
    if (!result.matchedCount) return res.status(404).json({ message: 'Plant not found' });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

// Vercel uses the exported app as a serverless function. Keep listen() for local development only.
if (require.main === module) {
  app.listen(port, () => console.log(`Plant Care API listening on port ${port}`));
}

module.exports = app;
