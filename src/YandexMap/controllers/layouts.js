import Api from '../api';
import isEqual from 'lodash/isEqual';

function detectImagesLoaded(el) {
    const images = Array.from(el.querySelectorAll('img') || []);

    if (!images.length) return Promise.resolve();

    return Promise.all(images.map((image)=>{
        return new Promise((resolve)=>{
            if (image.complete) {
                resolve();
                return;
            }
            image.onload = image.onerror = resolve;
        })
    }))
}

function createLayout(_ref) {
    let {domElement, extendsMethods = {}} = _ref;

    let LayoutClass = Api.getApi().templateLayoutFactory.createClass('<i/>', Object.assign({
        build() {
            LayoutClass.superclass.build.call(this);

            this.options = this.getData().options;

            this._setupContent(domElement);
            this._updateSize();

            detectImagesLoaded(this.getElement()).then(this._updateMarkerShape.bind(this));
        },
        getShape() {
            return new (Api.getApi().shape.Rectangle)(new (Api.getApi().geometry.pixel.Rectangle)([[0, 0], [this._size[0], this._size[1]]]))
        },
        _updateMarkerShape() {
            this._updateSize();
            this.events.fire('shapechange');
        },
        _setupContent(domElement) {
            this.getElement().appendChild(domElement)
        },
        _updateSize() {
            this._size = this._getSize();
        },
        _getSize() {
            let elementSize = [];

            if (this.getElement()) {
                const element = this.getElement().querySelector('.icon-content');

                if (element) elementSize = [element.offsetWidth, element.offsetHeight];
            }

            return elementSize;
        }
    }), extendsMethods);

    return LayoutClass
}

export default {
    createIconLayoutClass(domElement) {
        return createLayout({
            domElement,
            extendMethods: {
                _updateSize() {
                    let _this = this;
                    let geoObject = void 0;
                    let oldSize = this._size;

                    this._size = this._getSize();

                    if (this._size.length) {
                        if (!oldSize || !isEqual(oldSize, this._size)) {
                            geoObject = this.getData().geoObject;

                            if (geoObject.getOverlaySync()) {
                                geoObject.options.set('iconOffset', [-this._size[0] / 2, -this._size[1]])
                            } else {
                                geoObject.getOverlay().then(()=>{
                                    geoObject.options.set('iconOffset', [-_this._size[0] / 2, -_this._size[1]])
                                })
                            }
                        }
                    }
                }
            }
        })
    },
    createBalloonLayoutClass(domElement) {
        return createLayout({domElement});
    }
}