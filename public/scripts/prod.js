const deleteProd = prod => {
  if (confirm('Are you sure ?')) {
    const prodId = prod.parentNode.querySelector('[name=prodId]').value;
    const token = prod.parentNode.querySelector('[name=_csrf]').value;
    const elem = prod.closest('tr');

    fetch('/product/' + prodId, { // ret prom
      method: 'DELETE',
      headers: {
        'csrf-token': token
      }
    })
      .then(reslt => reslt.json()) // ret prom
      .then(data => {
        console.log(data);
        elem.remove(); // modern browsers
        // elem.parentNode.removeChild(elem); // IE
      })
      .catch(err => console.log(err));
  }
};
