import { useSubscribe } from "replicache-react";
import { getProjectInbox } from "../../../db/projects";
import {
  UrlNavLinkPlanner,
  UrlPriorityPeek,
  UrlProjectsList,
} from "../../AppRouter";
import { useReplicache } from "../../ReplicacheProvider";
import { IconBolt, IconBurger, IconCalendar } from "../../utils/Icons";
import { MobileNavItem } from "./MobileNavItem";

export function MobileNavContent() {
  const rep = useReplicache();

  const projectInbox = useSubscribe(rep, getProjectInbox(), null, [rep]);

  return (
    <div className="flex flex-row items-center justify-around h-full">
      <MobileNavItem to={UrlProjectsList()}>
        <IconBurger />
      </MobileNavItem>

      <MobileNavItem to={UrlNavLinkPlanner()}>
        <IconCalendar />
      </MobileNavItem>

      <MobileNavItem to={UrlPriorityPeek()}>
        <IconBolt />
      </MobileNavItem>
    </div>
  );
}
