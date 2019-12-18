import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { DefaultErrorBoundary, serverMarkup } from "../../dist";
import { is_server } from "../../dist/util";

Enzyme.configure({ adapter: new Adapter() });

describe("is_server in server", () => {
  it("should is_server be false", () => {
    expect(is_server()).toBeFalsy();
  });
});

describe("When no JS errors are caught in a child component", () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(
      <DefaultErrorBoundary>
        <h1>wassup</h1>
      </DefaultErrorBoundary>
    );
  });

  it("should update the state to indicate an error", () => {
    expect(wrapper.state().hasError).toBeFalsy();
  });

  it("should render the child component", () => {
    expect(wrapper.find("h1").exists()).toBeTruthy();
  });
});

describe("When a JS error is caught in a child component", () => {
  let wrapper;

  beforeAll(() => {
    jest.spyOn(global.console, "log");

    const ProblemChild = () => {
      throw new Error("Error thrown from problem child");
      return <div>Error</div>;
    };
    wrapper = mount(
      <DefaultErrorBoundary>
        <ProblemChild />
      </DefaultErrorBoundary>
    );
  });

  it("should log an error to console", () => {
    expect(global.console.log).toHaveBeenCalledTimes(1);
  });

  it("should update the state to indicate an error", () => {
    expect(wrapper.state().hasError).toBeTruthy();
  });

  it("should not render the child component", () => {
    expect(wrapper.find("h1").exists()).toBeFalsy();
  });
});
