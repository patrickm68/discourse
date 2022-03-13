import UserMenuDefaultNotificationItem from "discourse/components/user-menu/default-notification-item";
import I18n from "I18n";

export default class UserMenuCustomNotificationItem extends UserMenuDefaultNotificationItem {
  get title() {
    if (this.data.title) {
      return I18n.t(data.title);
    }
  }

  get icon() {
    return `notification.${this.data.message}`;
  }
}
