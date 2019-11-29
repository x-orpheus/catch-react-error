import React from 'react';
import { shallow } from 'enzyme';

import catchreacterror from '../../dist';

describe('When no JS errors are caught in a child component', () => {
    let ErrorBoundaryComponent;

    beforeAll(() => {
        ErrorBoundaryComponent = shallow(
            <ErrorBoundary>
                <h1>wassup </h1>
            </ErrorBoundary>
        );
    });

    it('should render the child component', () => {
        expect(ErrorBoundaryComponent.find('h1').exists()).toBeTruthy();
    });
});

describe('When a JS error is caught in a child component', () => {
    let ErrorBoundaryComponent;

    beforeAll(() => {
        jest.spyOn(global.console, 'log');
        ErrorBoundaryComponent = shallow(
            <ErrorBoundary>
                <h1>wassup</h1>
            </ErrorBoundary>
        );
        ErrorBoundaryComponent.instance().componentDidCatch(
            'oh nooos an error'
        );
        ErrorBoundaryComponent.update();
    });

    it('should log an error to console', () => {
        expect(global.console.log).toHaveBeenCalledWith('oh nooos an error');
    });

    it('should update the state to indicate an error', () => {
        expect(ErrorBoundaryComponent.instance().state.hasError).toBeTruthy();
    });

    it('should not render the child component', () => {
        expect(ErrorBoundaryComponent.find('h1').exists()).toBeFalsy();
    });
});
