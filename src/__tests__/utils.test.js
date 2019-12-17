/**
 * @jest-environment node
 */
import React from "react";
import { IsomorphicErrorBoundary } from "../../dist";
import { is_server, isComponentClass } from "../../dist/util";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { func } from "prop-types";

Enzyme.configure({ adapter: new Adapter() });

describe("is_server in server", () => {
  it("should is_server be false", () => {
    expect(is_server()).toBeTruthy();
  });
});

describe("check isComponentClass", () => {
  it("should isComponentClass be false", () => {
    const Button = () => <button>click me!</button>;
    expect(isComponentClass(Button)).toBeFalsy();
  });

  it("should isComponentClass be false", () => {
    function Button() {
      return <button>click me!</button>;
    }
    expect(isComponentClass(Button)).toBeFalsy();
  });

  it("should isComponentClass be true", () => {
    class Button extends React.Component {
      render() {
        return <button>click me!</button>;
      }
    }
    expect(isComponentClass(Button)).toBeTruthy();
  });
});

describe("When no JS errors are caught in a child component", () => {
  let wrapper;
  beforeAll(() => {
    wrapper = shallow(
      <IsomorphicErrorBoundary>
        <h1>no problem children</h1>
      </IsomorphicErrorBoundary>
    );
  });

  it("should update the state to indicate an error", () => {
    expect(wrapper.state().hasError).toBeFalsy();
  });

  it("should render the child component", () => {
    expect(wrapper.html()).toBe("<h1>no problem children</h1>");
  });
});
