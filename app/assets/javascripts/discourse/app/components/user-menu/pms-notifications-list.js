import UserMenuNotificationsList from "discourse/components/user-menu/notifications-list";

export default class UserMenuPmsNotificationsList extends UserMenuNotificationsList {
  get filterByType() {
    return "private_message";
  }
}
