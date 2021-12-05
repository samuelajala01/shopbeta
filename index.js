const db = new Dexie('ShoppingApp')
db.version(1).stores({items: '++id,name,price,isPurchased'} )

const itemForm = document.getElementById('itemForm')
const itemsDiv = document.getElementById('itemsDiv')
const totalPrice = document.getElementById('totalPriceDiv')
const deleteAllItemButton = document.getElementById('deleteAllItemButton')


const populateitemsDiv = async () => {
  const allItems = await db.items.reverse().toArray()

itemsDiv.innerHTML = allItems.map(item => `
    <div class="item ${item.isPurchased && 'purchased'}">
    <label>
      <input 
      type="checkbox"
      class="checkbox"
      onchange="toggleItemStatus(event, ${item.id})"
       ${item.isPurchased && 'checked'}>
    </label>

    <div class="itemInfo" id = "itemId">
      <p>${item.name}</p>
      <p>$${item.price} x ${item.quantity}</p>
    </div>

    <button class="deleteButton" onclick="removeItem(${item.id})">
    X
    </button>
    </div>
    `).join('')
    const  arrayOfPrices = allItems.map(item => item.price * item.quantity)
    const totalPrice = arrayOfPrices.reduce((a, b) => a + b, 0)

    totalPriceDiv.innerText = 'Total price: $' + totalPrice

}


window.onload = populateitemsDiv

itemForm.onsubmit = async (event) =>{
  event.preventDefault()

  let name =document.getElementById('nameInput').value
  let quantity = document.getElementById('quantityInput').value
  let price = document.getElementById('priceInput').value

  await db.items.add({ name, quantity,price })
  await populateitemsDiv()
 
  itemForm.reset()
}

const toggleItemStatus = async (event, id) => {
  await db.items.update(id, { isPurchased: !!event.target.checked})
  await populateitemsDiv()
}

const removeItem = async (id) => {
  await db.items.delete(id)
  await populateitemsDiv()
}

deleteAllItemButton.onclick = async (event) => {
  event.preventDefault()

  let name = document.getElementById('nameInput').value
  let quantity = document.getElementById('quantityInput').value
  let price = document.getElementById('priceInput').value

  if(confirm('Are you sure you want to delete all Items from the list?')){
    await db.items.clear({ name, quantity, price })
    await populateitemsDiv()
  }
}
