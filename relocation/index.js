const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.cleanupInactiveUsersManual = functions.https.onRequest(async (req, res) => {
  const db = admin.firestore();

  const now = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(now.getMonth() - 2);

  const snapshot = await db.collection("users").get();

  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    if (!data.lastLoginAt) continue;

    const lastLogin = data.lastLoginAt.toDate();

    if (lastLogin < twoMonthsAgo) {
      await doc.ref.update({
        status: "inactive",
        inactiveAt: admin.firestore.FieldValue.serverTimestamp()
      });

      count++;
    }
  }
  if (req.query.key !== "valueglow-secret") {
  return res.status(403).send("Forbidden");
  }
  res.send(`完了：${count}件のユーザーをinactive化しました`);
});
