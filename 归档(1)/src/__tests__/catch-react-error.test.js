import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import catchreacterror, { IsomorphicErrorBoundary } from '../../dist';

Enzyme.configure({ adapter: new Adapter() });


describe('catch-react-error', () => {

    beforeAll(() => {
        jest.spyOn(global.console, 'log');
    })

    class User extends React.Component {
        render() {
            const { name, address, other } = this.props;
            return (
                <div>
                    <p>{name}</p>
                    <p>{address}</p>
                    <p>{other.email}</p>
                </div>
            )
        }
    }
    it('Renders the child component if there is no error', () => {
        const wrapper = mount(
            <IsomorphicErrorBoundary>
                <User name="Harry" address="hangzhou" other={{ email: 'hello@163.com' }} />
            </IsomorphicErrorBoundary>,
        );

        const UserWithErrorBoundary = catchreacterror()(User);
        const wrapperWithErrorBoundary = mount(
            <UserWithErrorBoundary name="Harry" address="hangzhou" other={{ email: 'hello@163.com' }} />,
        );

        expect(wrapper.state().hasError).toBeFalsy()
        expect(wrapper.contains(<User name="Harry" address="hangzhou" other={{ email: 'hello@163.com' }} />)).toBeTruthy();

        expect(wrapperWithErrorBoundary.find(IsomorphicErrorBoundary).instance().state.hasError).toBeFalsy()
        expect(wrapperWithErrorBoundary.containsMatchingElement((
            <User name="Harry" address="hangzhou" other={{ email: 'hello@163.com' }} />
        ))).toBeTruthy()

    });

    it('Renders the fallback if there has an error', () => {
        const wrapper = mount(
            <IsomorphicErrorBoundary>
                <User name="Harry" address="hangzhou" />
            </IsomorphicErrorBoundary>,
        );

        const UserWithErrorBoundary = catchreacterror()(User);
        const wrapperWithErrorBoundary = mount(
            <UserWithErrorBoundary name="Harry" address="hangzhou" />,
        );

        expect(wrapper.state().hasError).toBeTruthy()
        expect(wrapper.contains(<div>Something is Wrong</div>)).toBeTruthy();

        expect(wrapperWithErrorBoundary.find(IsomorphicErrorBoundary).instance().state.hasError).toBeTruthy()
        expect(wrapperWithErrorBoundary.containsMatchingElement((
            <div>Something is Wrong</div>
        ))).toBeTruthy()

    });

    it('Renders the fallback if there has an error', () => {
        const wrapper = mount(
            <IsomorphicErrorBoundary>
                <User name="Harry" address="hangzhou" />
            </IsomorphicErrorBoundary>,
        );

        const UserWithErrorBoundary = catchreacterror()(User);
        const wrapperWithErrorBoundary = mount(
            <UserWithErrorBoundary name="Harry" address="hangzhou" />,
        );

        expect(wrapper.state().hasError).toBeTruthy()
        expect(wrapper.contains(<div>Something is Wrong</div>)).toBeTruthy();

        expect(wrapperWithErrorBoundary.find(IsomorphicErrorBoundary).instance().state.hasError).toBeTruthy()
        expect(wrapperWithErrorBoundary.containsMatchingElement((
            <div>Something is Wrong</div>
        ))).toBeTruthy()

    });

    it('Use default IsomorphicErrorBoundary when the ErrorBoundary is not React Class', () => {
        const ErrorBoundary=()=><div>some ivited ErrorBoundary</div>

        const UserWithErrorBoundary = catchreacterror(ErrorBoundary)(User);
        const wrapperWithErrorBoundary = mount(
            <UserWithErrorBoundary name="Harry" address="hangzhou" />,
        );

        expect(wrapperWithErrorBoundary.find(IsomorphicErrorBoundary).instance().state.hasError).toBeTruthy()
        expect(wrapperWithErrorBoundary.containsMatchingElement((
            <div>Something is Wrong</div>
        ))).toBeTruthy()
    });

    it("Use default IsomorphicErrorBoundary when the ErrorBoundary doesn't have componentDidCatch lifecycle", () => {
        class ErrorBoundaryWithoutComponentDidCatch extends React.Component {
            render (){
                return 'ErrorBoundary'
            }
        }

        const UserWithErrorBoundary = catchreacterror(ErrorBoundaryWithoutComponentDidCatch)(User);
        const wrapperWithErrorBoundary = mount(
            <UserWithErrorBoundary name="Harry" address="hangzhou"/>,
        );

        expect(wrapperWithErrorBoundary.find(IsomorphicErrorBoundary).instance().state.hasError).toBeTruthy()
        expect(wrapperWithErrorBoundary.containsMatchingElement((
            <div>Something is Wrong</div>
        ))).toBeTruthy()

    });
});