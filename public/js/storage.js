const ItemsStorage = (() => {
    /**
     * A class wrapper performing actions on localStorage
     * Implementing protected properties and methods
     * @returns {ItemsStorage}
     */
    let _items; // protected property

    const _loadInitialData = items => {
        /**
         * Protected method for initializing data for storage
         * @param {string} items Stringified JSON data from localStorage
         */
        if (items === null) {
            _items = [];
        } else {
            try {
                _items = JSON.parse(items);
            } catch (error) {
                _items = [];
            }
        }
    };

    const _isIdValid = item => {
        /**
         * Protected method to validate item ID
         * @param {number|string} item Item to validate
         * @returns {boolean}
         */
        const parsedValue = parseInt(item, 10);

        return typeof(item) === 'number' || !isNaN(parsedValue);
    };

    class ItemsStorage {
        constructor(prefix, id) {
            /**
             * Public constructor for storage class
             * @param {string} prefix A prefix used in localStorage key
             * @param {number|string} id An ID of collection of items
             * @property {string} key A key for items in localStorage
             */
            this.key = `${prefix}-${id}`;
            this.initStorage();
        }

        get selectedItems() {
            /**
             * Public getter for protected property _items
             * @returns {number[]}
             */
            return _items;
        }

        initStorage() {
            /**
             * Initialize the storage by calling the protected _getInitialData method
             * @returns {number[]|Array}
             */
            _loadInitialData(window.localStorage.getItem(this.key));
        }

        saveStorage() {
            /**
             * Saving stored items to localStorage
             * May be passed to window.onbeforeunload handler
             */
            window.localStorage.setItem(this.key, JSON.stringify(_items));
        }

        clearStorage() {
            /**
             * Clear the storage; after successfull AJAX request
             */
            _items = [];
        }

        addItem(item) {
            /**
             * Add item to storage if type is valid
             * @param {number|string} item Item ID to save to storage
             */
            if (_isIdValid(item)) {
                _items.push(item);
            } else {
                throw new TypeError('An item ID must be a valid number.');
            }
        }

        removeItem(item) {
            /**
             * Remove item from storage
             * @param {number|string} item ID of item to remove
             */
            if (_isIdValid(item)) {
                _items.splice(_items.indexOf(item), 1);
            } else {
                throw new TypeError('An item ID must be a valid number.');
            }
        }
    }
    return ItemsStorage;
})();
