import UserMenuDefaultNotificationItem from "discourse/components/user-menu/default-notification-item";
import I18n from "I18n";

export default class UserMenuBookmarkReminderNotificationItem extends UserMenuDefaultNotificationItem {
  get title() {
    if (this.notificationName) {
      if (this.data.bookmark_name) {
        return I18n.t(
          `notifications.titles.${this.notificationName}_with_name`,
          {
            name: this.data.bookmark_name,
          }
        );
      } else {
        return I18n.t(`notifications.titles.${this.notificationName}`);
      }
    }
  }
}
