import { UrlInbox, UrlNavLinkPlanner, UrlProjectsList } from "../../Router";
import { IconBurger, IconCalendar, IconInbox } from "../../utils/Icons";
import { MobileNavItem } from "./MobileNavItem";

export function MobileNavContent() {
  return (
    <div className="flex flex-row items-center justify-around h-full">
      <MobileNavItem to={UrlProjectsList()}>
        <IconBurger />
      </MobileNavItem>

      <MobileNavItem to={UrlNavLinkPlanner()}>
        <IconCalendar />
      </MobileNavItem>

      <MobileNavItem to={UrlInbox()}>
        <IconInbox />
      </MobileNavItem>
    </div>
  );
}
