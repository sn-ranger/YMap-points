function toOnEventName(name) {
    return 'on' + name.substr(0,1).toUpperCase() + name.substr(1)
}

export function register(controller, props, eventsList) {
    eventsList.forEach((eventName)=>{
        const onEventName = toOnEventName(eventName);
        if (props.hasOwnProperty(onEventName)) {
            controller.events.add(eventName, props[onEventName])
        }
    })
}