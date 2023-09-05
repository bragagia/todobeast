import dynamic from "next/dynamic";
import React from "react";

const NoSSRComponent = (props: any) => (
  <React.Fragment>{props.children}</React.Fragment>
);

export default dynamic(() => Promise.resolve(NoSSRComponent), {
  ssr: false,
});
