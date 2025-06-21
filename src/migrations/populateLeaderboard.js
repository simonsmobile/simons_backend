// Run this ONCE after deploying the new code to populate existing users

const StudentService = require("../services/students.service");
const LeaderboardService = require("../services/leaderboard.service");

const firebase = require('../configs/db');
const firestore = firebase.firestore();

const studentCollection = firestore.collection("students");

async function populateLeaderboard() {
  console.log("Starting leaderboard population...");

  try {
    const studentsSnapshot = await studentCollection.get();
    let processed = 0;
    let total = studentsSnapshot.size;

    for (const studentDoc of studentsSnapshot.docs) {
      const studentData = studentDoc.data();

      // Skip if no email or not approved
      if (!studentData.email || !studentData.approved) {
        processed++;
        continue;
      }

      try {
        // Calculate total score for this user
        const totalScore = await StudentService.getTotalAccumulatedScore(
          studentData.email
        );

        // Update leaderboard
        await LeaderboardService.updateUserLeaderboard(studentData.email, {
          name:
            `${studentData.firstName || ""} ${
              studentData.lastName || ""
            }`.trim() || studentData.email.split("@")[0],
          totalScore: totalScore.totalScore,
        });

        processed++;
        console.log(
          `Processed ${processed}/${total}: ${studentData.email} (${totalScore.totalScore} points)`
        );

        // Small delay to avoid overwhelming Firestore
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing ${studentData.email}:`, error);
        processed++;
      }
    }

    console.log("Leaderboard population completed!");
  } catch (error) {
    console.error("Error populating leaderboard:", error);
  }
}

// Run the migration
populateLeaderboard();
