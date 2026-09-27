import liff from '@line/liff';

export interface LineUserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

class LiffService {
  private isInitialized = false;
  private profile: LineUserProfile | null = null;

  async init(liffId: string): Promise<LineUserProfile | null> {
    if (!liffId || liffId.trim() === '') return null;
    try {
      if (!this.isInitialized) {
        await liff.init({ liffId });
        this.isInitialized = true;
      }

      if (liff.isLoggedIn()) {
        const rawProfile = await liff.getProfile();
        this.profile = {
          userId: rawProfile.userId,
          displayName: rawProfile.displayName,
          pictureUrl: rawProfile.pictureUrl,
          statusMessage: rawProfile.statusMessage,
        };
        return this.profile;
      }
    } catch (err) {
      console.warn('LIFF init warning:', err);
    }
    return null;
  }

  getProfile(): LineUserProfile | null {
    return this.profile;
  }

  isInLiff(): boolean {
    try {
      return liff.isInClient();
    } catch {
      return false;
    }
  }

  isLoggedIn(): boolean {
    try {
      return liff.isLoggedIn();
    } catch {
      return false;
    }
  }

  closeWindow() {
    try {
      if (liff.isInClient()) {
        liff.closeWindow();
      }
    } catch (err) {
      console.error('LIFF close window error:', err);
    }
  }
}

export const liffService = new LiffService();
