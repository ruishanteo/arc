import { create } from "zustand";

// export type Notification = {
//   id: string;
//   severity: 'info' | 'warning' | 'success' | 'error';
//   message: string;
// };

// type NotificationsStore = {
//   notifications: Notification[];
//   addNotification: (notification: Omit<Notification, 'id'>) => void;
//   dismissNotification: (id: string) => void;
// };

let i = 0;

export const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const t = i++;

    set((state) => ({
      notifications: [...state.notifications, { id: t, ...notification }],
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification.id !== t
        ),
      }));
    }, 2500);
  },
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    })),
}));
