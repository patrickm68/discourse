import UserMenuDefaultNotificationItem from "discourse/components/user-menu/default-notification-item";
import getURL from "discourse-common/lib/get-url";

export default class UserMenuGrantedBadgeNotificationItem extends UserMenuDefaultNotificationItem {
  get url() {
    const notification = this.args.item;
    const data = notification.data;
    const badgeId = data.badge_id;
    if (badgeId) {
      let slug = data.badge_slug;
      if (!slug) {
        slug = data.badge_name.replace(/[^A-Za-z0-9_]+/g, "-").toLowerCase();
      }
      let username = data.username;
      username = username ? `?username=${username.toLowerCase()}` : "";
      return getURL(`/badges/${badgeId}/${slug}${username}`);
    } else {
      return super.url;
    }
  }
}
