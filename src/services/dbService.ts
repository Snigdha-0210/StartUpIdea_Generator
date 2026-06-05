import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';

export const dbService = {
  // ================= USERS =================
  async createUser(userId: string, userData: any) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUser(userId: string) {
    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // ================= STARTUP IDEAS =================
  async saveStartupIdea(userId: string, ideaId: string, ideaData: any) {
    try {
      const ideaRef = doc(db, 'startupIdeas', ideaId);
      await setDoc(ideaRef, {
        ...ideaData,
        userId,
        createdAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error saving startup idea:', error);
      throw error;
    }
  },

  async getStartupIdeas(userId: string) {
    try {
      const ideasRef = collection(db, 'startupIdeas');
      const q = query(ideasRef, where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting startup ideas:', error);
      throw error;
    }
  },

  async updateStartupIdea(ideaId: string, updates: any) {
    try {
      const ideaRef = doc(db, 'startupIdeas', ideaId);
      await updateDoc(ideaRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating startup idea:', error);
      throw error;
    }
  },

  async deleteStartupIdea(ideaId: string) {
    try {
      const ideaRef = doc(db, 'startupIdeas', ideaId);
      await deleteDoc(ideaRef);
      return true;
    } catch (error) {
      console.error('Error deleting startup idea:', error);
      throw error;
    }
  },

  // ================= REPORTS =================
  async saveReport(userId: string, reportId: string, reportData: any) {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await setDoc(reportRef, {
        ...reportData,
        userId,
        createdAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  },

  async getReports(userId: string) {
    try {
      const reportsRef = collection(db, 'reports');
      const q = query(reportsRef, where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting reports:', error);
      throw error;
    }
  }
};
