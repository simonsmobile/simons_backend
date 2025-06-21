const firebase = require("../configs/db");
const firestore = firebase.firestore();
const admin = require("firebase-admin");

const leaderboardCollection = firestore.collection("leaderboard");

class LeaderboardService {
  async updateUserLeaderboard(email, userData) {
    try {
      const leaderboardData = {
        email: email,
        name: userData.name || userData.firstName || email.split("@")[0],
        totalScore: userData.totalScore || 0,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      };

      await leaderboardCollection
        .doc(email)
        .set(leaderboardData, { merge: true });
      console.log(
        `Leaderboard updated for ${email} with score ${userData.totalScore}`
      );
    } catch (error) {
      console.error(`Error updating leaderboard for ${email}:`, error);
      throw error;
    }
  }

  async getLeaderboard(userEmail) {
    try {
      const leaderboardSnapshot = await leaderboardCollection
        .orderBy("totalScore", "desc")
        .get();

      if (leaderboardSnapshot.empty) {
        return {
          leaderboard: [],
          userRank: 0,
          totalUsers: 0,
        };
      }

      const allUsers = [];
      leaderboardSnapshot.forEach((doc) => {
        const data = doc.data();
        allUsers.push({
          ...data,
          isCurrentUser: data.email === userEmail,
        });
      });

      const currentUserIndex = allUsers.findIndex(
        (user) => user.email === userEmail
      );
      const currentUserRank =
        currentUserIndex !== -1 ? currentUserIndex + 1 : 0;

      const top5 = allUsers.slice(0, 5);

      let finalLeaderboard = [...top5];
      if (currentUserIndex >= 5) {
        finalLeaderboard.push(allUsers[currentUserIndex]);
      }

      return {
        leaderboard: finalLeaderboard,
        userRank: currentUserRank,
        totalUsers: allUsers.length,
      };
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      throw new Error("Failed to get leaderboard data");
    }
  }

  async initializeUserLeaderboard(email, userData) {
    try {
      const exists = await leaderboardCollection.doc(email).get();
      if (!exists.exists) {
        await this.updateUserLeaderboard(email, {
          name: userData.name || userData.firstName || email.split("@")[0],
          totalScore: 0,
        });
      }
    } catch (error) {
      console.error(`Error initializing leaderboard for ${email}:`, error);
    }
  }
}

module.exports = new LeaderboardService();
