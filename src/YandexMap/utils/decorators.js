import {register} from './eventsHandler';

export function eventsDecorator(Component, _ref) {
    const supportEvents = _ref.supportEvents;

    Object.defineProperty(Component.prototype, '_setupEvents', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function value() {
            register(this.getController(), this.props, supportEvents)
        }
    });

    return Component;
}