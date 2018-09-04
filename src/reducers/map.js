const initialState = {
    apiAvailable: false,
    center: [55.754734, 37.583314],
    state: {
        controls: ['zoomControl']
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'MAP_SET': {
            return {
                ...state,
                ...action.model
            }
        }
        default: {
            return state
        }
    }
}