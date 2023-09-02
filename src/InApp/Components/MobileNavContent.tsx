import { useSubscribe } from "replicache-react";
import { rep } from "src/Replicache";
import { getProjectInbox } from "src/db/projects";
import { UrlNavLinkPlanner, UrlProject, UrlProjectsList } from "../../Router";
import { IconBurger, IconCalendar, IconInbox } from "../../utils/Icons";
import { MobileNavItem } from "./MobileNavItem";

export function MobileNavContent() {
  const projectInbox = useSubscribe(rep, getProjectInbox(), null, [rep]);

  return (
    <div className="flex flex-row items-center justify-around h-full">
      <MobileNavItem to={UrlProjectsList()}>
        <IconBurger />
      </MobileNavItem>

      <MobileNavItem to={UrlNavLinkPlanner()}>
        <IconCalendar />
      </MobileNavItem>

      <MobileNavItem
        to={
          projectInbox ? UrlProject(projectInbox?.id, projectInbox?.name) : ""
        }
      >
        <IconInbox />
      </MobileNavItem>
    </div>
  );
}
