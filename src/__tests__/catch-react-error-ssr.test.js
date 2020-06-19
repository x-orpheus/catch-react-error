/**
 * @jest-environment node
 */
import React from "react";
import catchreacterror, { DefaultErrorBoundary } from "../../dist";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("catch-react-error", () => {
  beforeAll(() => {
    jest.spyOn(global.console, "log");
  });

  class User extends React.Component {
    render() {
      const { name, address, other } = this.props;
      return (
        <div>
          <p>{name}</p>
          <p>{address}</p>
          <p>{other.email}</p>
        </div>
      );
    }
  }

  const UserFirstName = props => <h1>{props.name.fristNmae}</h1>;

  it("SSR: Renders the child component if there is no error", () => {
    const wrapper = shallow(
      <DefaultErrorBoundary>
        <User
          name="Harry"
          address="hangzhou"
          other={{ email: "hello@163.com" }}
        />
      </DefaultErrorBoundary>
    );

    const UserWithErrorBoundary = catchreacterror()(User);
    const wrapperWithErrorBoundary = shallow(
      <UserWithErrorBoundary
        name="Harry"
        address="hangzhou"
        other={{ email: "hello@163.com" }}
      />
    );
    expect(wrapper.html()).toBe(
      "<div><p>Harry</p><p>hangzhou</p><p>hello@163.com</p></div>"
    );
    expect(
      wrapper.contains(
        <User
          name="Harry"
          address="hangzhou"
          other={{ email: "hello@163.com" }}
        />
      )
    ).toBeTruthy();

    expect(wrapperWithErrorBoundary.html()).toBe(
      "<div><p>Harry</p><p>hangzhou</p><p>hello@163.com</p></div>"
    );
  });

  it("SSR: Renders the fallback if there has error", () => {
    const wrapper = shallow(
      <DefaultErrorBoundary>
        <User name="Harry" address="hangzhou" />
      </DefaultErrorBoundary>
    );

    const UserWithErrorBoundary = catchreacterror()(User);
    const wrapperWithErrorBoundary = shallow(
      <UserWithErrorBoundary name="Harry" address="hangzhou" />
    );
    expect(wrapper.html()).toBe("<div>Something is Wrong</div>");
    expect(wrapperWithErrorBoundary.html()).toBe(
      "<div>Something is Wrong</div>"
    );
  });

  it("SSR: Renders the child component if there is no error", () => {
    const wrapper = shallow(
      <DefaultErrorBoundary>
        <UserFirstName name={{ fristNmae: "James" }} />
      </DefaultErrorBoundary>
    );

    const UserWithErrorBoundary = catchreacterror()(UserFirstName);
    const wrapperWithErrorBoundary = shallow(
      <UserWithErrorBoundary name={{ fristNmae: "James" }} />
    );
    expect(wrapper.html()).toBe("<h1>James</h1>");
    expect(wrapperWithErrorBoundary.html()).toBe("<h1>James</h1>");
  });

  it("SSR: Renders the fallback if there has error", () => {
    const UserWithErrorBoundary = catchreacterror()(UserFirstName);
    const wrapperWithErrorBoundary = shallow(<UserWithErrorBoundary />);
    expect(wrapperWithErrorBoundary.html()).toBe(
      "<div>Something is Wrong</div>"
    );
  });
});
