import { mount } from "enzyme";
import * as React from "react";
import { builder } from "ts-url-pattern";
import { route, Router } from "./index";

class NumPage extends React.PureComponent<{ spam: number, eggs: number }, never> {
  public render() {
    return <div>num: {this.props.spam} extra: {this.props.eggs}</div>;
  }
}

const StrPage: React.SFC<{ bar: string }> = (props) => {
  return <div>str: {props.bar}</div>;
};

const NotFound: React.SFC<never> = () => {
  return <div>not found</div>;
};

describe("Router", () => {
  it("should", () => {
    const numRoute = builder.raw("foo").num("spam");
    const strRoute = builder.raw("foo").str("bar");

    function router(url: string) {
      return (
        <Router url={url} notFound={React.createFactory(NotFound)}>{[
          route(numRoute, { eggs: 20 }, React.createFactory(NumPage)),
          route(strRoute, {}, React.createFactory(StrPage))
        ]}</Router>
      );
    }

    expect(mount(router('/')).text()).toBe('not found');
    expect(mount(router('/foo/string')).text()).toBe('str: string');
    expect(mount(router('/foo/10')).text()).toBe('num: 10 extra: 20');
  });
});
