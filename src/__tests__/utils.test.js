/**
 * @jest-environment node
 */
import React from 'react';
import { IsomorphicErrorBoundary, is_server, serverMarkup } from '../../dist';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('is_server in server', () => {
    it('should is_server be false', () => {
        expect(is_server()).toBeTruthy();
    });
});

describe('When no JS errors are caught in a child component', () => {
    let wrapper;
    beforeAll(() => {
        wrapper = shallow(
            <IsomorphicErrorBoundary>
                <h1>no problem children</h1>
            </IsomorphicErrorBoundary>
        );
    });

    it('should update the state to indicate an error', () => {
        expect(wrapper.state().hasError).toBeFalsy();
    });

    it('should render the child component', () => {
        expect(wrapper.html()).toBe('<div><h1>no problem children</h1></div>');
    });
});
