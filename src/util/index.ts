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

export default {
    is_server,
    isComponentClass
}