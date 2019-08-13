const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=id]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf').value;

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err));
};