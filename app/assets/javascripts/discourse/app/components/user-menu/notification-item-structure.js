import GlimmerComponent from "discourse/components/glimmer";
import { postUrl } from "discourse/lib/utilities";
import { userPath } from "discourse/lib/url";
import I18n from "I18n";

// TODO handle notification icon aria stuff
export default class UserMenuNotificationItemStructure extends GlimmerComponent {
  get notificationName() {
    const notification = this.args.notification;
    return this.site.notificationLookup[notification.notification_type];
  }

  get url() {
    if (this.args.url) {
      return this.args.url;
    }
    const notification = this.args.notification;
    const data = notification.data;
    const topicId = notification.topic_id;
    if (topicId) {
      return postUrl(notification.slug, topicId, notification.post_number);
    }

    if (data.group_id) {
      return userPath(`${data.username}/messages/group/${data.group_name}`);
    }
  }

  get icon() {
    if (this.args.icon) {
      return this.args.icon;
    }
    return `notification.${this.notificationName}`;
  }

  get className() {
    // TODO handle mod warning message in pm notification item
    const classes = [];
    const notification = this.args.notification;
    if (notification.read) {
      classes.push("read");
    }
    if (this.notificationName) {
      classes.push(this.notificationName.replace(/_/g, "-"));
    }
    return classes.join(" ");
  }
}
