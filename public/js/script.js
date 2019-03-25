function toggleButtonActive(items) {
    $('#delete-selected').prop('disabled', items.length <= 0);
}

function updateCheckboxes(items) {
    const $items = $('tbody tr');

    $items.each((i, el) => {
       const $cb = $(el).find('.item');
       $cb.prop('checked', items.includes($cb.data('item-id')));
    });
}

function removeRows(items) {
    for (let item of items) {
       $('tbody').find(`[data-item-id="${item}"]`)
           .parent()
           .parent()
           .remove();
    }
}

$(document).ready(() => {
    const collectionId = $('#collection-container').data('collection-id');
    const store = new ItemsStorage('storedItems', collectionId);

    $('.item').click(ev => {
        const $cb = $(ev.currentTarget);

        if ($cb.is(':checked')) {
            try {
                store.addItem($cb.data('item-id'));
            } catch (e) {
                console.error(e);
            }
        } else {
            try {
                store.removeItem($cb.data('item-id'));
            } catch (e) {
                console.error(e);
            }
        }

        toggleButtonActive(store.selectedItems);
    });

    $('#delete-selected').click(() => {
        $.ajax({
            type: 'DELETE',
            url: `/collections/${collectionId}/items`,
            data: JSON.stringify({ items: store.selectedItems }),
            contentType: 'application/json'
        }).then(res => {
            console.log(res);
            removeRows(store.selectedItems);
            store.clearStorage();
        }).catch(err => console.log(err));
    });

    window.addEventListener('beforeunload', () => {
        store.saveStorage();
        return null;
    });

    toggleButtonActive(store.selectedItems);
    updateCheckboxes(store.selectedItems);
});