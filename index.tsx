import * as React from 'react';
import { IMatcher } from "ts-url-pattern";

export type IRoute = (url: string) => JSX.Element | undefined;

export function route<M, P extends object>(matcher: IMatcher<M>, params: P, factory: (args: M & P) => JSX.Element): (url: string) => JSX.Element | undefined {
  return (url: string) => {
    const match = matcher.match(url);
    if (match) {
      const result = {} as M & P;
      for (const key of Object.keys(params)) {
        result[key] = params[key];
      }
      for (const key of Object.keys(match)) {
        result[key] = match[key];
      }
      return factory(result);
    }
    return undefined;
  }
}

export interface IRouterProps {
  readonly url: string;
  readonly children: Array<IRoute>;
  readonly notFound: () => JSX.Element;
}

export const Router: React.SFC<IRouterProps> = (props) => {
  for (const child of props.children) {
    const route = child(props.url);
    if (route) {
      return route;
    }
  }
  return props.notFound();
};
