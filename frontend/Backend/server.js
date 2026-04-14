const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. TURN ON DEBUG MODE
// This will log the actual collection name Mongoose is querying in your terminal
mongoose.set('debug', true);

const MONGO_URI = 'mongodb://db_user:db-project-password@ac-rosqmsc-shard-00-00.f5p9msj.mongodb.net:27017,ac-rosqmsc-shard-00-01.f5p9msj.mongodb.net:27017,ac-rosqmsc-shard-00-02.f5p9msj.mongodb.net:27017/CompetitionPortal?ssl=true&replicaSet=atlas-kdpz6n-shard-0&authSource=admin&appName=CS-220-Database-Project-1';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to CompetitionPortal'))
  .catch(err => console.error('❌ Connection error:', err));

const competitionSchema = new mongoose.Schema({
  competition_name: String,
  host_university: String,
  typical_venue: String,
  recurring_month: String,
  registration_fee: String,
  participation_certificate: Boolean,
  format: String,
  is_physical: Boolean,
  programming_languages: [String],
}, { 
  collection: 'Pakistan_Competition', // Force exact name
  strict: false                       // Allows reading data even if schema isn't perfect
});

// 2. PASS THE COLLECTION NAME AGAIN HERE
const Competition = mongoose.model('Competition', competitionSchema, 'Pakistan_Competition');

app.get('/api/competitions', async (req, res) => {
 try {
    const data = await Competition.aggregate([
      {
        $group: {
          _id: "$competition_name", // Group by name to remove duplicates
          doc: { $first: "$$ROOT" } // Keep the first full document found
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" } // Flatten the structure back to normal
      },
      {
        $project: { __v: 0 } // Hide the version key
      }
    ]);

    const mapped = data.map(obj => ({
      ...obj,
      fee_label: obj.registration_fee
    }));

    res.status(200).json(mapped);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Running on http://localhost:${PORT}`));