import { db } from "../config/firebase.js";

const applicationCollection = db.collection("Applications"); 

export const ApplicationModel = {
  async findAll() {
    const snapshot = await applicationCollection.get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },
  
  async create(data) {
    const docRef = await applicationCollection.add(data);

    return {
        id: docRef.id,
        ...data
      };
    },

    async updateStatus(id, status) {
      const docRef = applicationCollection.doc(id);

      await docRef.update({
        status
      });

      return { id, status };
    },

  async findByJobId(jobId) {
    const snapshot = await applicationCollection
      .where("jobId", "==", jobId)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};