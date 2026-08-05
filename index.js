const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI ||
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1jlx3rd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let plantCollection;
let isConnected = false;

// Lazy DB connection - safe for Vercel serverless functions
async function connectDB() {
    if (isConnected) return;

    if (!process.env.MONGODB_URI && (!process.env.DB_USER || !process.env.DB_PASS)) {
        throw new Error("MongoDB credentials are not configured");
    }

    await client.connect();
    isConnected = true;
    plantCollection = client
        .db(process.env.MONGODB_DB_NAME || "plantDB")
        .collection(process.env.MONGODB_COLLECTION || "coffees");

    console.log("MongoDB Connected");
}

// Public routes that do not require the database
app.get("/", (req, res) => {
    res.json({ ok: true, service: "Plant Care API" });
});

app.get("/health", (req, res) => {
    res.json({ ok: true });
});

// Browsers request these automatically; no icon is required for the API.
app.get(["/favicon.ico", "/favicon.png"], (req, res) => {
    res.status(204).end();
});

// Middleware: ensure DB is connected before plant requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection error:", error.message);
        res.status(500).json({ message: "Database connection failed" });
    }
});

function getObjectId(id) {
    return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

// ==================== PLANTS ====================

app.post("/plants", async (req, res, next) => {
    try {
        const result = await plantCollection.insertOne(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

app.get("/plants", async (req, res, next) => {
    try {
        const result = await plantCollection.find().toArray();
        res.json(result);
    } catch (error) {
        next(error);
    }
});

app.get("/plants/:id", async (req, res, next) => {
    try {
        const id = getObjectId(req.params.id);
        if (!id) return res.status(400).json({ message: "Invalid plant id" });

        const result = await plantCollection.findOne({ _id: id });
        if (!result) return res.status(404).json({ message: "Plant not found" });

        res.json(result);
    } catch (error) {
        next(error);
    }
});

app.delete("/plants/:id", async (req, res, next) => {
    try {
        const id = getObjectId(req.params.id);
        if (!id) return res.status(400).json({ message: "Invalid plant id" });

        const result = await plantCollection.deleteOne({ _id: id });
        if (!result.deletedCount) return res.status(404).json({ message: "Plant not found" });

        res.json(result);
    } catch (error) {
        next(error);
    }
});

app.put("/plants/:id", async (req, res, next) => {
    try {
        const id = getObjectId(req.params.id);
        if (!id) return res.status(400).json({ message: "Invalid plant id" });

        const result = await plantCollection.updateOne(
            { _id: id },
            { $set: req.body },
            { upsert: false },
        );

        if (!result.matchedCount) return res.status(404).json({ message: "Plant not found" });
        res.json(result);
    } catch (error) {
        next(error);
    }
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
});

// Vercel uses the exported app. This keeps local development working too.
if (require.main === module) {
    app.listen(process.env.PORT || 3000, () => {
        console.log("Plant Care API is running");
    });
}

// ==================== EXPORT FOR VERCEL ====================
module.exports = app;
