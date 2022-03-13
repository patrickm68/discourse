import GlimmerComponent from "discourse/components/glimmer";
import I18n from "I18n";

export default class UserMenuReviewableItem extends GlimmerComponent {
  get actor() {
    const reviewable = this.args.item;
    const flagger = reviewable.flagger_username;
    if (flagger) {
      return flagger;
    } else {
      return I18n.t("user_menu.reviewable.deleted_user");
    }
  }

  get description() {
    const reviewable = this.args.item;
    return I18n.t("user_menu.reviewable.default_item", {
      reviewable_id: reviewable.id,
    });
  }

  get icon() {
    return "flag";
  }
}
