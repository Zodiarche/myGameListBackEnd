import mongoose from "mongoose";
import gameData from "./models/game-data.js";

mongoose.connect("mongodb://localhost:27017/myGameList");

const removeDuplicates = async () => {
  try {
    const duplicates = await gameData.aggregate([
      {
        $group: {
          _id: "$idGameBD",
          uniqueIds: { $addToSet: "$_id" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    for (const doc of duplicates) {
      doc.uniqueIds.shift();
      await gameData.deleteMany({ _id: { $in: doc.uniqueIds } });
    }

    console.log("Doublons supprimés avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression des doublons:", error);
  } finally {
    mongoose.connection.close();
  }
};

removeDuplicates();
