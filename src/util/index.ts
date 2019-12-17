export function is_server(): boolean {
    return !(typeof window !== 'undefined' && window.document);
}

export function isComponentClass<T>(Component: React.ComponentClass<T> | React.StatelessComponent<T>): Component is React.ComponentClass<T> {
    return Component.prototype && Component.prototype.render;
}

export default {
    is_server,
    isComponentClass
}