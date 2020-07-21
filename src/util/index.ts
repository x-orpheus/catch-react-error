export function is_server(): boolean {
    if (typeof window !== 'undefined' && window.document) {
        return false // web browser
    } else if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
        return false // ReactNative https://github.com/facebook/react-native/issues/1331#issuecomment-183903948
    } else {
        return true // node.js
    }
}

export function isComponentClass<T>(Component: React.ComponentClass<T> | React.StatelessComponent<T>): Component is React.ComponentClass<T> {
    return Component.prototype && Component.prototype.render;
}

export function isReactMemo(Component: React.MemoExoticComponent<React.ComponentType<any>> | React.FunctionComponent):  Component is React.MemoExoticComponent<React.ComponentType<any>>{
    return typeof Component !== 'function' && !!Component['$$typeof'];
}

export default {
    is_server,
    isComponentClass
}