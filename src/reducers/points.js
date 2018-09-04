const initialState = {
    pointName: '',
    markers: [
        {
            index: 0,
            id: 'point-1',
            coords: [55.737693, 37.723390],
            name: 'Point-1'
        },
        {
            index: 1,
            id: 'point-2',
            coords: [55.744665, 37.491304],
            name: 'Point-2'
        },
        {
            index: 2,
            id: 'point-3',
            coords: [55.636063, 37.566835],
            name: 'Point-3'
        },
        {
            index: 3,
            id: 'point-4',
            coords: [55.865323, 37.599794],
            name: 'Point-4'
        },
        {
            index: 4,
            id: 'point-5',
            coords: [55.741567, 37.960969],
            name: 'Point-5'
        },
    ]
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'POINTS_SET':
            return {
                ...state,
                ...action.model
            };
        case 'POINTS_CHANGE':
            return {
                ...state,
                [action.field]: action.value
            };
        default:
            return state;
    }
}