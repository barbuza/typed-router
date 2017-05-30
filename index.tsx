import * as React from "react";
import { IMatcher } from "ts-url-pattern";

export interface IRouteProps<T = object> {
  readonly url: IMatcher<T>;
  readonly component: React.ComponentClass<T> | React.SFC<T>;
}

export function Route<T = object>(props: IRouteProps<T>): React.SFCElement<IRouteProps<T>> {
  // tslint:disable-next-line
  !!props;
  throw new Error("Route must be direct child of Router");
}

export interface IRouterProps {
  readonly url: string;
  readonly children: Array<React.ReactElement<IRouteProps>>;
  readonly notFound: React.ComponentClass<never> | React.SFC<never>;
}

export const Router: React.SFC<IRouterProps> = (props) => {
  let route: JSX.Element | undefined;
  for (const child of props.children) {
    if (child.type !== Route) {
      throw new Error("all Router children must be Route elements");
    }
    const args = child.props.url.match(props.url);
    if (args) {
      route = <child.props.component {...args} />;
      break;
    }
  }
  if (!route) {
    return <props.notFound />;
  }
  return route;
};
