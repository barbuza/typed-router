import { shallow } from "enzyme";
import * as React from "react";
import { builder } from "ts-url-pattern";
import { Route, Router } from "./index";

class NumPage extends React.PureComponent<{ spam: number }, never> {
  public render() {
    return <div>num: {this.props.spam}</div>;
  }
}

const StrPage: React.SFC<{ bar: string }> = (props) => {
  return <div>str: {props.bar}</div>;
};

function NotFound() {
  return <div>not found</div>;
}

describe("Router", () => {
  it("shouldnt", () => {
    expect(() => {
      shallow(<Route url={builder} component={NotFound} />);
    }).toThrow(/direct child/);

    expect(() => {
      shallow(
        <Router url="/" notFound={NotFound}>
          <div />
          <div />
        </Router>,
      );
    }).toThrow(/Router children/);
  });

  it("should", () => {
    const numRoute = builder.raw("foo").num("spam");
    const strRoute = builder.raw("foo").str("bar");

    function router(url: string) {
      return (
        <Router url={url} notFound={NotFound}>
          <Route url={numRoute} component={NumPage} />
          <Route url={strRoute} component={StrPage} />
        </Router>
      );
    }

    expect(shallow(router("/")).find(NotFound).exists()).toBe(true);
    expect(shallow(router("/foo/string")).find(StrPage).exists()).toBe(true);
    expect(shallow(router("/foo/string")).find(StrPage).props()).toEqual({ bar: "string" });
    expect(shallow(router("/foo/10")).find(NumPage).exists()).toBe(true);
    expect(shallow(router("/foo/10")).find(NumPage).props()).toEqual({ spam: 10 });
  });
});
