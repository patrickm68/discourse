import GlimmerComponent from "discourse/components/glimmer";
import { action } from "@ember/object";

export default class UserMenuButton extends GlimmerComponent {
  @action
  onClick() {
    if (this.args.onClick) {
      this.args.onClick();
    }
  }
}
