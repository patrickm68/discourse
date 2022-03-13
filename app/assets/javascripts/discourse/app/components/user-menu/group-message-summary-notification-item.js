import UserMenuDefaultNotificationItem from "discourse/components/user-menu/default-notification-item";

export default class UserMenuGroupMessageSummaryNotificationItem extends UserMenuDefaultNotificationItem {
  get inboxCount() {
    return this.data.inbox_count;
  }
}
